#!/usr/bin/env node
/**
 * GROWMATE DeepSeek API 连通性测试
 * 用法: node test-deepseek.mjs
 * 
 * 需要先在项目根目录创建 .env.local 文件并填入:
 * VITE_DEEPSEEK_API_KEY=sk-xxx
 */

import { readFileSync } from 'fs'
import { join } from 'path'

// 读取 .env.local 文件
function loadEnv() {
  const envPath = join(process.cwd(), '.env.local')
  try {
    const content = readFileSync(envPath, 'utf-8')
    const env = {}
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const [key, ...valueParts] = trimmed.split('=')
      env[key.trim()] = valueParts.join('=').trim()
    }
    return env
  } catch {
    console.error('❌ 未找到 .env.local 文件')
    console.log('请在项目根目录创建 .env.local 并填入 VITE_DEEPSEEK_API_KEY')
    process.exit(1)
  }
}

const env = loadEnv()
const API_KEY = env.VITE_DEEPSEEK_API_KEY

if (!API_KEY) {
  console.error('❌ VITE_DEEPSEEK_API_KEY 未配置')
  console.log('请在 .env.local 中添加: VITE_DEEPSEEK_API_KEY=sk-xxx')
  process.exit(1)
}

// Validate that the API key is not a placeholder value
if (!/^sk-[a-zA-Z0-9]{20,}$/.test(API_KEY) || API_KEY.includes('xxx') || API_KEY === 'sk-placeholder') {
  console.error('❌ VITE_DEEPSEEK_API_KEY appears to be a placeholder, not a real API key.')
  console.log('  Current value looks like a template (e.g. sk-xxx).')
  console.log('  Please replace it with a valid DeepSeek API key from https://platform.deepseek.com/api_keys')
  process.exit(1)
}

console.log('🔍 测试 DeepSeek API 连通性...')
console.log(`📡 API Endpoint: https://api.deepseek.com/v1/chat/completions`)
console.log(`🔑 API Key: ${API_KEY.slice(0, 8)}...${API_KEY.slice(-4)}`)
console.log('')

async function testBasicConnectivity() {
  console.log('1️⃣ 基础连通性测试 (模型列表)...')
  try {
    const res = await fetch('https://api.deepseek.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    })
    
    if (res.ok) {
      const data = await res.json()
      const modelCount = data.data?.length || 0
      console.log(`✅ 连接成功! 可用模型数: ${modelCount}`)
      if (data.data) {
        const models = data.data.slice(0, 5).map(m => m.id).join(', ')
        console.log(`   部分模型: ${models}`)
      }
      return true
    } else {
      const errText = await res.text().catch(() => 'Unknown error')
      console.error(`❌ HTTP ${res.status}: ${errText.slice(0, 200)}`)
      return false
    }
  } catch (err) {
    console.error(`❌ 网络错误: ${err.message}`)
    return false
  }
}

async function testChatCompletion() {
  console.log('\n2️⃣ 对话完成测试 (deepseek-chat)...')
  const startTime = Date.now()
  
  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: '请用一句话介绍你自己，并用JSON格式返回，格式：{"name": "...", "description": "..."}',
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    })
    
    if (!res.ok) {
      const errText = await res.text().catch(() => 'Unknown error')
      console.error(`❌ HTTP ${res.status}: ${errText.slice(0, 200)}`)
      return false
    }
    
    const data = await res.json()
    const elapsed = Date.now() - startTime
    
    const choice = data.choices?.[0]
    if (!choice?.message?.content) {
      console.error('❌ 响应为空')
      return false
    }
    
    console.log(`✅ 响应成功! 耗时: ${elapsed}ms`)
    console.log(`📝 模型: ${data.model}`)
    console.log(`📊 Token使用: prompt=${data.usage?.prompt_tokens}, completion=${data.usage?.completion_tokens}, total=${data.usage?.total_tokens}`)
    console.log(`💬 回复内容: ${choice.message.content.slice(0, 150)}...`)
    return true
  } catch (err) {
    console.error(`❌ 请求错误: ${err.message}`)
    return false
  }
}

async function testJSONOutput() {
  console.log('\n3️⃣ JSON 输出测试 (CoT推理格式)...')
  const startTime = Date.now()
  
  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个教育评估AI。请严格按照JSON格式返回分析结果，不要包含任何其他文本。',
          },
          {
            role: 'user',
            content: `一个8岁学生在"好奇心(W)"维度得分85/100，在"执行力(D)"维度得分40/100。
请用JSON格式返回分析，格式如下：
{
  "observation": "观察到的现象描述",
  "inference": "可能的原因推断",
  "prediction": "未来发展趋势",
  "confidence": 0.8
}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
    })
    
    if (!res.ok) {
      const errText = await res.text().catch(() => 'Unknown error')
      console.error(`❌ HTTP ${res.status}: ${errText.slice(0, 200)}`)
      return false
    }
    
    const data = await res.json()
    const elapsed = Date.now() - startTime
    
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      console.error('❌ 响应为空')
      return false
    }
    
    // 尝试解析 JSON
    try {
      const parsed = JSON.parse(content)
      console.log(`✅ JSON 解析成功! 耗时: ${elapsed}ms`)
      console.log(`📋 解析结果:`)
      console.log(`   观察: ${parsed.observation?.slice(0, 50)}...`)
      console.log(`   推断: ${parsed.inference?.slice(0, 50)}...`)
      console.log(`   预测: ${parsed.prediction?.slice(0, 50)}...`)
      console.log(`   置信度: ${parsed.confidence}`)
      return true
    } catch (parseErr) {
      console.error(`❌ JSON 解析失败: ${parseErr.message}`)
      console.error(`   原始内容: ${content.slice(0, 200)}...`)
      return false
    }
  } catch (err) {
    console.error(`❌ 请求错误: ${err.message}`)
    return false
  }
}

// 主流程
async function main() {
  console.log('='.repeat(60))
  console.log('GROWMATE DeepSeek API 连通性测试')
  console.log('='.repeat(60))
  console.log('')
  
  const results = {
    connectivity: await testBasicConnectivity(),
    chat: await testChatCompletion(),
    json: await testJSONOutput(),
  }
  
  console.log('')
  console.log('='.repeat(60))
  console.log('测试结果汇总')
  console.log('='.repeat(60))
  console.log(`基础连通性: ${results.connectivity ? '✅ 通过' : '❌ 失败'}`)
  console.log(`对话完成:    ${results.chat ? '✅ 通过' : '❌ 失败'}`)
  console.log(`JSON输出:   ${results.json ? '✅ 通过' : '❌ 失败'}`)
  console.log('')
  
  const allPassed = Object.values(results).every(Boolean)
  if (allPassed) {
    console.log('🎉 所有测试通过! DeepSeek API 已就绪，可以开始使用 AI 功能')
  } else {
    console.log('⚠️  部分测试失败，请检查:')
    console.log('   1. API Key 是否正确')
    console.log('   2. 网络连接是否正常')
    console.log('   3. DeepSeek 账户余额是否充足')
    console.log('   4. 防火墙/代理设置')
  }
  console.log('')
  
  process.exit(allPassed ? 0 : 1)
}

main().catch(err => {
  console.error('未捕获错误:', err)
  process.exit(1)
})
