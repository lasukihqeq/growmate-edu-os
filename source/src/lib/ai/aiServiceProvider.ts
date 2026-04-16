// ===================================================================
// GROWMATE AI-Native 引擎 — 统一LLM API服务 v1.0.0
// Provider降级链：DeepSeek → OpenAI → MiniMax
// 三者均兼容OpenAI Chat Completions API格式
// ===================================================================

import type {
  LLMMessage,
  LLMResponse,
  StreamChunk,
  ProviderConfig,
  AIServiceConfig,
  ProviderStatus,
  AICallOptions,
} from './types'

// ============================================================
// 默认配置
// ============================================================

const DEFAULT_CONFIG: AIServiceConfig = {
  providers: [],
  defaultModel: 'deepseek-chat',
  maxRetries: 3,
  retryBaseDelayMs: 1000,
  timeoutMs: 30000,
  enableStreaming: true,
  fallbackToTemplate: true,
}

function buildProviders(): ProviderConfig[] {
  const providers: ProviderConfig[] = []

  const deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (deepseekKey) {
    providers.push({
      name: 'deepseek',
      apiKey: deepseekKey,
      baseUrl: 'https://api.deepseek.com/v1',
      defaultModel: 'deepseek-chat',
      priority: 1,
      enabled: true,
    })
  }

  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (openaiKey) {
    providers.push({
      name: 'openai',
      apiKey: openaiKey,
      baseUrl: 'https://api.openai.com/v1',
      defaultModel: 'gpt-4o',
      priority: 2,
      enabled: true,
    })
  }

  const minimaxKey = import.meta.env.VITE_MINIMAX_API_KEY
  if (minimaxKey) {
    providers.push({
      name: 'minimax',
      apiKey: minimaxKey,
      baseUrl: 'https://api.minimax.chat/v1',
      defaultModel: 'abab6.5s-chat',
      priority: 3,
      enabled: true,
    })
  }

  return providers.sort((a, b) => a.priority - b.priority)
}

// ============================================================
// AIServiceProvider 类
// ============================================================

export class AIServiceProvider {
  private providers: ProviderConfig[]
  private providerStatus: Map<string, ProviderStatus>
  private config: AIServiceConfig

  // 前端限流：滑动窗口记录
  private requestTimestamps: number[] = []
  private readonly maxRequestsPerMinute = 30 // 每分钟最大请求数
  private readonly maxRequestsPerHour = 200  // 每小时最大请求数

  constructor(config: Partial<AIServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.providers = this.config.providers.length > 0
      ? this.config.providers
      : buildProviders()

    if (this.providers.length === 0) {
      this.config.fallbackToTemplate = true
      console.warn('[AIService] No API keys configured, falling back to templates')
    }

    this.providerStatus = new Map()
    for (const p of this.providers) {
      this.providerStatus.set(p.name, {
        name: p.name,
        healthy: true,
        consecutiveFailures: 0,
      })
    }
  }

  // ============================================================
  // 前端限流检查
  // ============================================================
  private checkRateLimit(): { allowed: boolean; retryAfter?: number } {
    const now = Date.now()
    const oneMinuteAgo = now - 60_000
    const oneHourAgo = now - 3_600_000

    // 清理过期时间戳
    this.requestTimestamps = this.requestTimestamps.filter(t => t > oneHourAgo)

    // 检查每分钟限制
    const requestsLastMinute = this.requestTimestamps.filter(t => t > oneMinuteAgo).length
    if (requestsLastMinute >= this.maxRequestsPerMinute) {
      const oldestInWindow = this.requestTimestamps.find(t => t > oneMinuteAgo)
      const retryAfter = oldestInWindow ? Math.ceil((oldestInWindow + 60_000 - now) / 1000) : 60
      return { allowed: false, retryAfter }
    }

    // 检查每小时限制
    const requestsLastHour = this.requestTimestamps.length
    if (requestsLastHour >= this.maxRequestsPerHour) {
      const oldestInWindow = this.requestTimestamps[0]
      const retryAfter = oldestInWindow ? Math.ceil((oldestInWindow + 3_600_000 - now) / 1000) : 3600
      return { allowed: false, retryAfter }
    }

    return { allowed: true }
  }

  private recordRequest(): void {
    this.requestTimestamps.push(Date.now())
  }

  // ============================================================
  // 核心方法：chatCompletion（同步）
  // ============================================================

  async chatCompletion(
    messages: LLMMessage[],
    options?: AICallOptions,
  ): Promise<LLMResponse | null> {
    // 限流检查
    const rateLimit = this.checkRateLimit()
    if (!rateLimit.allowed) {
      console.warn(`[AIService] Rate limited. Retry after ${rateLimit.retryAfter}s`)
      throw new Error(`请求过于频繁，请在 ${rateLimit.retryAfter} 秒后重试`)
    }

    for (const provider of this.providers) {
      if (!provider.enabled) continue

      const status = this.providerStatus.get(provider.name)
      if (status && !this.shouldTryProvider(status)) continue

      for (let retry = 0; retry < this.config.maxRetries; retry++) {
        try {
          this.recordRequest()
          const response = await this.doRequest(provider, messages, options, retry)
          this.markHealthy(provider.name)
          return response
        } catch (err) {
          const error = err as Error
          const shouldRetry = this.shouldRetry(error, retry)
          if (shouldRetry) {
            await this.sleep(this.config.retryBaseDelayMs * Math.pow(2, retry))
            continue
          }
          this.markUnhealthy(provider.name, error.message)
          break
        }
      }
    }

    if (this.config.fallbackToTemplate) {
      console.warn('[AIService] All providers failed, falling back to templates')
    }
    return null
  }

  // ============================================================
  // 核心方法：chatCompletionStream（流式）
  // ============================================================

  async *chatCompletionStream(
    messages: LLMMessage[],
    options?: AICallOptions,
  ): AsyncGenerator<StreamChunk> {
    const provider = this.providers.find(p => p.enabled && this.shouldTryProvider(this.providerStatus.get(p.name) || { name: p.name, healthy: true, consecutiveFailures: 0 }))
    if (!provider) {
      console.warn('[AIService] No available provider for streaming')
      return
    }

    try {
      yield* this.doStreamRequest(provider, messages, options)
      this.markHealthy(provider.name)
    } catch (err) {
      const error = err as Error
      console.error(`[AIService] Stream error (${provider.name}):`, error.message)
      this.markUnhealthy(provider.name, error.message)
      throw err
    }
  }

  // ============================================================
  // 辅助方法
  // ============================================================

  getProviderStatus(): ProviderStatus[] {
    return Array.from(this.providerStatus.values())
  }

  resetProvider(name: string): void {
    const status = this.providerStatus.get(name)
    if (status) {
      status.consecutiveFailures = 0
      status.healthy = true
      delete status.lastError
    }
  }

  hasAnyProvider(): boolean {
    return this.providers.length > 0
  }

  // ============================================================
  // 私有方法
  // ============================================================

  private shouldTryProvider(status: ProviderStatus): boolean {
    if (status.consecutiveFailures < 5) return true
    if (!status.lastError) return true
    const lastFail = new Date(status.lastError).getTime()
    const cooldownMs = 5 * 60 * 1000 // 5分钟
    return Date.now() - lastFail > cooldownMs
  }

  private markHealthy(name: string): void {
    const status = this.providerStatus.get(name)
    if (status) {
      status.healthy = true
      status.consecutiveFailures = 0
      status.lastSuccessAt = new Date().toISOString()
    }
  }

  private markUnhealthy(name: string, error: string): void {
    const status = this.providerStatus.get(name)
    if (status) {
      status.healthy = false
      status.consecutiveFailures++
      status.lastError = error
    }
  }

  private shouldRetry(error: Error, retryCount: number): boolean {
    const msg = error.message.toLowerCase()
    if (msg.includes('429') || msg.includes('rate limit')) return true
    if (msg.includes('5') && retryCount < this.config.maxRetries - 1) return true
    if (msg.includes('timeout') || msg.includes('network') || msg.includes('fetch')) return true
    return false
  }

  private async doRequest(
    provider: ProviderConfig,
    messages: LLMMessage[],
    options?: AICallOptions,
    retryCount: number = 0,
  ): Promise<LLMResponse> {
    const body = {
      model: options?.model || provider.defaultModel,
      messages,
      temperature: options?.temperature ?? 0.5,
      max_tokens: options?.maxTokens ?? 2048,
      stream: false,
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs)

    try {
      const res = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (res.status === 429) {
        const retryAfter = res.headers.get('Retry-After')
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : this.config.retryBaseDelayMs * Math.pow(2, retryCount)
        await this.sleep(delay)
        throw new Error(`Rate limited (${provider.name})`)
      }

      if (!res.ok) {
        const errText = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status}: ${errText.slice(0, 200)}`)
      }

      const data = await res.json()
      const choice = data.choices?.[0]
      if (!choice?.message?.content) {
        throw new Error('Empty response from LLM')
      }

      return {
        content: choice.message.content,
        model: data.model || provider.defaultModel,
        usage: {
          prompt_tokens: data.usage?.prompt_tokens || 0,
          completion_tokens: data.usage?.completion_tokens || 0,
          total_tokens: data.usage?.total_tokens || 0,
        },
        finishReason: choice.finish_reason || 'stop',
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }

  private async *doStreamRequest(
    provider: ProviderConfig,
    messages: LLMMessage[],
    options?: AICallOptions,
  ): AsyncGenerator<StreamChunk> {
    const body = {
      model: options?.model || provider.defaultModel,
      messages,
      temperature: options?.temperature ?? 0.5,
      max_tokens: options?.maxTokens ?? 4096,
      stream: true,
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs * 2)

    try {
      const res = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      if (!res.ok) {
        clearTimeout(timeoutId)
        const errText = await res.text().catch(() => '')
        throw new Error(`Stream HTTP ${res.status}: ${errText.slice(0, 200)}`)
      }

      if (!res.body) {
        clearTimeout(timeoutId)
        throw new Error('No response body for streaming')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed === 'data: [DONE]') {
            if (trimmed === 'data: [DONE]') {
              yield { delta: '', finishReason: 'stop' }
            }
            continue
          }
          if (!trimmed.startsWith('data: ')) continue

          try {
            const json = JSON.parse(trimmed.slice(6))
            const delta = json.choices?.[0]?.delta?.content || ''
            const finishReason = json.choices?.[0]?.finish_reason || null
            if (delta || finishReason) {
              yield { delta, finishReason }
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// ============================================================
// 工厂函数与单例
// ============================================================

let _instance: AIServiceProvider | null = null

/** 创建AI服务实例 */
export function createAIServiceProvider(config: Partial<AIServiceConfig> = {}): AIServiceProvider {
  return new AIServiceProvider(config)
}

/** 获取全局单例 */
export function getDefaultProvider(): AIServiceProvider {
  if (!_instance) {
    _instance = new AIServiceProvider()
  }
  return _instance
}
