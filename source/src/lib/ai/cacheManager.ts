// ===================================================================
// GROWMATE AI 缓存管理引擎 v1.0.0
// 基于 IndexedDB 的 LLM 响应缓存，支持 TTL、命中统计、自动清理
// ===================================================================

import type { LLMMessage, LLMResponse } from './types'

// ============================================================
// 类型定义
// ============================================================

export interface CacheEntry {
  id: string
  messagesHash: string
  model: string
  response: LLMResponse
  createdAt: number
  ttlMs: number
  hitCount: number
  lastHitAt: number | null
}

export interface CacheStats {
  totalEntries: number
  totalSize: number
  hitCount: number
  missCount: number
  hitRate: number
  oldestEntry: number | null
  newestEntry: number | null
}

export interface CacheOptions {
  /** 缓存 TTL（毫秒），默认 24 小时 */
  ttlMs?: number
  /** 最大缓存条目数，默认 500 */
  maxEntries?: number
  /** 数据库名称 */
  dbName?: string
  /** 存储对象名 */
  storeName?: string
}

export interface CacheConfig {
  ttlMs: number
  maxEntries: number
  dbName: string
  storeName: string
}

const DEFAULT_CONFIG: CacheConfig = {
  ttlMs: 24 * 60 * 60 * 1000, // 24 小时
  maxEntries: 500,
  dbName: 'growmate-ai-cache',
  storeName: 'llm-responses',
}

// ============================================================
// 消息哈希工具
// ============================================================

/** 将消息数组转换为稳定的哈希值 */
export function hashMessages(messages: LLMMessage[]): string {
  const normalized = messages.map(m => ({
    role: m.role,
    content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
  }))
  const json = JSON.stringify(normalized)
  return simpleHash(json)
}

/** 生成缓存条目 ID */
export function cacheKey(messages: LLMMessage[], model: string): string {
  return `${model}:${hashMessages(messages)}`
}

/** 简单哈希函数（非加密级，适用于缓存键） */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

// ============================================================
// AICacheManager 类
// ============================================================

export class AICacheManager {
  private config: CacheConfig
  private db: IDBDatabase | null = null
  private dbReady: Promise<void> | null = null
  private stats = {
    hits: 0,
    misses: 0,
  }

  constructor(options: CacheOptions = {}) {
    this.config = { ...DEFAULT_CONFIG, ...options }
  }

  // ============================================================
  // 初始化
  // ============================================================

  async init(): Promise<void> {
    if (this.dbReady) return this.dbReady

    this.dbReady = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.config.storeName)) {
          const store = db.createObjectStore(this.config.storeName, { keyPath: 'id' })
          store.createIndex('messagesHash', 'messagesHash', { unique: false })
          store.createIndex('createdAt', 'createdAt', { unique: false })
          store.createIndex('lastHitAt', 'lastHitAt', { unique: false })
        }
      }
    })

    await this.dbReady
    await this.cleanupExpired()
  }

  // ============================================================
  // 核心方法：获取缓存
  // ============================================================

  async get(messages: LLMMessage[], model: string): Promise<LLMResponse | null> {
    if (!this.db) await this.init()

    const key = cacheKey(messages, model)

    return this.withStore('readonly', (store) => {
      return new Promise((resolve) => {
        const request = store.get(key)
        request.onsuccess = () => {
          const entry: CacheEntry | undefined = request.result
          if (!entry) {
            this.stats.misses++
            resolve(null)
            return
          }

          // 检查 TTL
          if (Date.now() - entry.createdAt > entry.ttlMs) {
            this.stats.misses++
            this.delete(key).catch(() => {})
            resolve(null)
            return
          }

          // 命中缓存
          this.stats.hits++
          entry.hitCount++
          entry.lastHitAt = Date.now()

          // 异步更新命中计数
          this.updateEntry(entry).catch(() => {})

          resolve(entry.response)
        }
        request.onerror = () => resolve(null)
      })
    })
  }

  // ============================================================
  // 核心方法：设置缓存
  // ============================================================

  async set(
    messages: LLMMessage[],
    model: string,
    response: LLMResponse,
  ): Promise<void> {
    if (!this.db) await this.init()

    const key = cacheKey(messages, model)

    // 检查是否超出最大条目数
    await this.enforceMaxEntries()

    const entry: CacheEntry = {
      id: key,
      messagesHash: hashMessages(messages),
      model,
      response,
      createdAt: Date.now(),
      ttlMs: this.config.ttlMs,
      hitCount: 0,
      lastHitAt: null,
    }

    return this.withStore('readwrite', (store) => {
      return new Promise((resolve, reject) => {
        const request = store.put(entry)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    })
  }

  // ============================================================
  // 删除缓存
  // ============================================================

  async delete(key: string): Promise<void> {
    if (!this.db) await this.init()

    return this.withStore('readwrite', (store) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(key)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    })
  }

  /** 清除所有缓存 */
  async clear(): Promise<void> {
    if (!this.db) await this.init()

    return this.withStore('readwrite', (store) => {
      return new Promise((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => {
          this.stats = { hits: 0, misses: 0 }
          resolve()
        }
        request.onerror = () => reject(request.error)
      })
    })
  }

  // ============================================================
  // 统计信息
  // ============================================================

  async getStats(): Promise<CacheStats> {
    if (!this.db) await this.init()

    return this.withStore('readonly', (store) => {
      return new Promise((resolve, reject) => {
        const request = store.getAllKeys()
        request.onsuccess = () => {
          const keys = request.result as string[]
          const countRequest = store.count()
          countRequest.onsuccess = () => {
            const total = countRequest.result
            const hitRate = this.stats.hits + this.stats.misses > 0
              ? this.stats.hits / (this.stats.hits + this.stats.misses)
              : 0

            resolve({
              totalEntries: total,
              totalSize: this.estimateSize(keys.length),
              hitCount: this.stats.hits,
              missCount: this.stats.misses,
              hitRate,
              oldestEntry: null, // 简化实现
              newestEntry: null,
            })
          }
          countRequest.onerror = () => reject(countRequest.error)
        }
        request.onerror = () => reject(request.error)
      })
    })
  }

  // ============================================================
  // 内部方法
  // ============================================================

  private async updateEntry(entry: CacheEntry): Promise<void> {
    if (!this.db) return

    return this.withStore('readwrite', (store) => {
      return new Promise((resolve) => {
        store.put(entry)
        resolve()
      })
    })
  }

  private async cleanupExpired(): Promise<void> {
    if (!this.db) return

    const now = Date.now()
    return this.withStore('readwrite', (store) => {
      return new Promise((resolve) => {
        const request = store.getAll()
        request.onsuccess = () => {
          const entries: CacheEntry[] = request.result
          for (const entry of entries) {
            if (now - entry.createdAt > entry.ttlMs) {
              store.delete(entry.id)
            }
          }
          resolve()
        }
        request.onerror = () => resolve()
      })
    })
  }

  private async enforceMaxEntries(): Promise<void> {
    if (!this.db) return

    return this.withStore('readonly', (store) => {
      return new Promise((resolve, reject) => {
        const countRequest = store.count()
        countRequest.onsuccess = () => {
          if (countRequest.result >= this.config.maxEntries) {
            // 删除最旧的条目
            this.deleteOldest().then(resolve).catch(reject)
          } else {
            resolve()
          }
        }
        countRequest.onerror = () => reject(countRequest.error)
      })
    })
  }

  private async deleteOldest(): Promise<void> {
    if (!this.db) return

    return this.withStore('readwrite', (store) => {
      return new Promise((resolve, reject) => {
        const index = store.index('createdAt')
        const request = index.openCursor()
        request.onsuccess = () => {
          const cursor = request.result
          if (cursor) {
            store.delete(cursor.primaryKey)
            resolve()
          } else {
            resolve()
          }
        }
        request.onerror = () => reject(request.error)
      })
    })
  }

  private withStore<T>(
    mode: IDBTransactionMode,
    fn: (store: IDBObjectStore) => Promise<T>,
  ): Promise<T> {
    if (!this.db) {
      return Promise.reject(new Error('Database not initialized'))
    }

    const tx = this.db.transaction(this.config.storeName, mode)
    const store = tx.objectStore(this.config.storeName)
    return fn(store)
  }

  private estimateSize(entryCount: number): number {
    // 粗略估计：每个条目约 2KB
    return entryCount * 2048
  }
}

// ============================================================
// 工厂函数与单例
// ============================================================

let _cacheInstance: AICacheManager | null = null

/** 创建缓存管理器实例 */
export function createAICacheManager(options?: CacheOptions): AICacheManager {
  return new AICacheManager(options)
}

/** 获取全局缓存单例 */
export function getDefaultCacheManager(): AICacheManager {
  if (!_cacheInstance) {
    _cacheInstance = new AICacheManager()
  }
  return _cacheInstance
}
