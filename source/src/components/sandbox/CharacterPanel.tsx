// ===================================================================
// 动态沙盘推演系统 - AI角色对话面板
// 支持角色情感系统：信任度/兴奋度/担忧度驱动表情、气泡样式和动画
// ===================================================================

import React, { useState, useEffect, useRef } from 'react'
import type { AICharacter, DialogueEntry } from '../../lib/sandbox/types'
import { getEncouragement } from '../../lib/sandbox/ageAdapter'

// ========== 角色情感状态接口 ==========

export interface CharacterEmotion {
  trust: number        // 信任度 0-100 (基于用户选择的一致性)
  excitement: number   // 兴奋度 0-100 (基于连击和快速决策)
  concern: number      // 担忧度 0-100 (基于犹豫和超时)
  currentExpression: 'happy' | 'curious' | 'serious' | 'worried' | 'excited'
}

interface CharacterPanelProps {
  character: AICharacter
  messages: DialogueEntry[]
  studentAge: number
  onSendMessage?: (message: string) => void
  showInput?: boolean
  currentDimension?: string
  emotion?: CharacterEmotion
}

// ========== 情感→表情 emoji 映射 ==========

const EXPRESSION_EMOJIS: Record<CharacterEmotion['currentExpression'], Record<string, string>> = {
  happy:   { robot_friend: '😄', mischievous_fairy: '🧚‍♀️', mentor: '😊', investor: '🤝', devil_advocate: '😏', competitor: '💪' },
  curious: { robot_friend: '🤔', mischievous_fairy: '✨', mentor: '🧐', investor: '📊', devil_advocate: '🔍', competitor: '👀' },
  serious: { robot_friend: '🤖', mischievous_fairy: '🧚', mentor: '👨‍🏫', investor: '💼', devil_advocate: '⚖️', competitor: '🏃' },
  worried: { robot_friend: '😟', mischievous_fairy: '🥺', mentor: '😰', investor: '📉', devil_advocate: '😬', competitor: '😥' },
  excited: { robot_friend: '🤩', mischievous_fairy: '🎉', mentor: '🌟', investor: '🚀', devil_advocate: '🔥', competitor: '⚡' },
}

// ========== 情感→气泡样式映射 ==========

/** 根据情感状态返回 AI 消息气泡的额外 Tailwind 类 */
function getEmotionBubbleStyles(emotion?: CharacterEmotion): string {
  if (!emotion) return ''
  const { currentExpression } = emotion
  switch (currentExpression) {
    case 'happy':
      return 'border-l-2 border-emerald-400 bg-emerald-50 text-emerald-900'
    case 'curious':
      return 'border-l-2 border-blue-400 bg-blue-50 text-blue-900'
    case 'serious':
      return '' // 默认灰色不变
    case 'worried':
      return 'border-l-2 border-amber-400 bg-amber-50 text-amber-900'
    case 'excited':
      return 'border-l-2 border-purple-400 bg-purple-50 text-purple-900'
    default:
      return ''
  }
}

// ========== 情感→头部渐变映射 ==========

function getEmotionHeaderGradient(emotion?: CharacterEmotion): string {
  if (!emotion) return 'from-purple-500 to-blue-600'
  switch (emotion.currentExpression) {
    case 'happy':   return 'from-emerald-500 to-teal-600'
    case 'curious':  return 'from-blue-500 to-indigo-600'
    case 'serious':  return 'from-purple-500 to-blue-600'
    case 'worried':  return 'from-amber-500 to-orange-600'
    case 'excited':  return 'from-pink-500 to-purple-600'
    default:         return 'from-purple-500 to-blue-600'
  }
}

// ========== 情感→鼓励语额外文本 ==========

function getEmotionEncouragementText(emotion?: CharacterEmotion): string | null {
  if (!emotion) return null
  const { trust, excitement, concern, currentExpression } = emotion

  // 高信任 + 兴奋：最佳正向反馈
  if (trust >= 70 && excitement >= 60) {
    return '🌟 角色对你非常信任，你们的默契越来越好！'
  }
  // 高担忧：安慰与鼓励
  if (concern >= 60) {
    return '🤗 别担心，慢慢来，角色正在耐心等你做出决定。'
  }
  // 高兴奋：激励
  if (excitement >= 70) {
    return '⚡ 你的快速反应让角色非常兴奋，继续保持！'
  }
  // 高信任：信赖感
  if (trust >= 60) {
    return '💙 角色越来越信任你的判断了。'
  }
  // 基于表情的通用提示
  switch (currentExpression) {
    case 'happy':   return '😊 角色看起来很开心呢！'
    case 'curious':  return '🤔 角色对你的下一步充满好奇...'
    case 'worried':  return '😟 角色有些担忧，给TA一些安全感吧。'
    case 'excited':  return '🎉 角色正热情高涨！'
    default:         return null
  }
}

// ========== 主组件 ==========

export const CharacterPanel: React.FC<CharacterPanelProps> = ({
  character,
  messages,
  studentAge,
  onSendMessage,
  showInput = false,
  currentDimension,
  emotion,
}) => {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 记录上一次 trust 值，用于检测增长触发弹跳动画
  const prevTrustRef = useRef<number>(emotion?.trust ?? 0)
  const [bouncing, setBouncing] = useState(false)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 当 trust 增加时触发弹跳动画
  useEffect(() => {
    const currentTrust = emotion?.trust ?? 0
    if (currentTrust > prevTrustRef.current) {
      setBouncing(true)
      const timer = setTimeout(() => setBouncing(false), 500) // 与 animate-character-bounce 时长一致
      return () => clearTimeout(timer)
    }
    prevTrustRef.current = currentTrust
  }, [emotion?.trust])

  const handleSend = () => {
    if (!inputValue.trim() || !onSendMessage) return
    onSendMessage(inputValue.trim())
    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getGreeting = (): string => {
    return character.dialogueStyle.greetingPattern[
      Math.floor(Math.random() * character.dialogueStyle.greetingPattern.length)
    ]
  }

  // 根据情感表情获取 emoji，回退到原有 archetype 映射
  const getEmoji = (): string => {
    if (emotion) {
      const expressionMap = EXPRESSION_EMOJIS[emotion.currentExpression]
      if (expressionMap && expressionMap[character.archetype]) {
        return expressionMap[character.archetype]
      }
    }
    const fallback: Record<string, string> = {
      robot_friend: '🤖',
      mischievous_fairy: '🧚',
      mentor: '👨‍🏫',
      investor: '💼',
      devil_advocate: '⚖️',
      competitor: '🏃',
    }
    return fallback[character.archetype] || '🤖'
  }

  const headerGradient = getEmotionHeaderGradient(emotion)
  const emotionExtraText = getEmotionEncouragementText(emotion)

  return (
    <div className="character-panel bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
      {/* 角色头部 — 渐变色根据情感变化 */}
      <div className={`p-4 bg-gradient-to-r ${headerGradient} text-white transition-colors duration-500`}>
        <div className="flex items-center gap-3">
          {/* 头像容器 — trust 增加时触发弹跳 */}
          <div
            className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-md transition-transform duration-300 ${
              bouncing ? 'animate-character-bounce' : ''
            }`}
          >
            {getEmoji()}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{character.name}</h3>
            <p className="text-xs text-white/80">
              {getArchetypeLabel(character.archetype)}
            </p>
          </div>
          {/* 情感状态迷你指示器 */}
          {emotion && (
            <div className="flex items-center gap-1.5">
              <EmotionMiniBar label="信任" value={emotion.trust} color="bg-emerald-300" />
              <EmotionMiniBar label="兴奋" value={emotion.excitement} color="bg-yellow-300" />
              <EmotionMiniBar label="担忧" value={emotion.concern} color="bg-red-300" />
            </div>
          )}
        </div>

        {/* 欢迎语 */}
        {messages.length === 0 && (
          <div className="mt-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-sm">{getGreeting()}</p>
          </div>
        )}
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            message={msg}
            isAI={msg.speaker === 'ai'}
            characterEmoji={getEmoji()}
            emotionBubbleClass={msg.speaker === 'ai' ? getEmotionBubbleStyles(emotion) : ''}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 鼓励语 + 情感额外文本 */}
      {((currentDimension && messages.length > 0) || emotionExtraText) && (
        <div className="px-4 py-2 bg-amber-50 border-t border-amber-100 space-y-1">
          {currentDimension && messages.length > 0 && (
            <p className="text-xs text-amber-700">
              💪 {getEncouragement(studentAge, currentDimension)}
            </p>
          )}
          {emotionExtraText && (
            <p className="text-xs text-purple-600 animate-fade-in">
              {emotionExtraText}
            </p>
          )}
        </div>
      )}

      {/* 输入框 */}
      {showInput && onSendMessage && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="回复AI角色..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B5FD9] focus:border-transparent text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`px-4 py-2 rounded-xl text-white font-medium transition-all ${
                inputValue.trim()
                  ? 'bg-gradient-to-r from-[#3B5FD9] to-[#0F9D94] hover:opacity-90'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              发送
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ========== 情感迷你条形指示器 ==========

interface EmotionMiniBarProps {
  label: string
  value: number  // 0-100
  color: string  // Tailwind bg class
}

const EmotionMiniBar: React.FC<EmotionMiniBarProps> = ({ label, value, color }) => (
  <div className="flex flex-col items-center gap-0.5" title={`${label}: ${value}`}>
    <div className="w-1.5 h-6 rounded-full bg-white/20 overflow-hidden flex flex-col-reverse">
      <div
        className={`w-full rounded-full transition-all duration-500 ${color}`}
        style={{ height: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
    <span className="text-[8px] text-white/60 leading-none">{label}</span>
  </div>
)

// ========== 消息气泡 ==========

interface MessageBubbleProps {
  message: DialogueEntry
  isAI: boolean
  characterEmoji: string
  emotionBubbleClass?: string
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isAI,
  characterEmoji,
  emotionBubbleClass = '',
}) => {
  // AI 气泡：当存在 emotionBubbleClass 时使用情感样式，否则使用默认灰色
  const aiBubbleBase = emotionBubbleClass
    ? `${emotionBubbleClass} rounded-tl-none`
    : 'bg-gray-100 text-gray-800 rounded-tl-none'

  return (
    <div className={`flex gap-2 ${isAI ? '' : 'flex-row-reverse'}`}>
      {/* 头像 */}
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-sm flex-shrink-0">
          {characterEmoji}
        </div>
      )}

      {/* 消息内容 */}
      <div
        className={`max-w-[80%] p-3 rounded-xl text-sm transition-colors duration-300 ${
          isAI
            ? aiBubbleBase
            : 'bg-gradient-to-r from-[#3B5FD9] to-[#0F9D94] text-white rounded-tr-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.emotion && (
          <p className="text-xs mt-1 opacity-60">
            {getEmotionEmoji(message.emotion)} {message.emotion}
          </p>
        )}
      </div>

      {/* 用户头像 */}
      {!isAI && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-sm flex-shrink-0">
          👤
        </div>
      )}
    </div>
  )
}

/** 获取角色类型标签 */
function getArchetypeLabel(archetype: string): string {
  const labels: Record<string, string> = {
    robot_friend: 'AI 小伙伴',
    mischievous_fairy: '魔法精灵',
    mentor: '导师',
    investor: '投资人',
    devil_advocate: '挑战者',
    competitor: '竞争对手',
  }
  return labels[archetype] || 'AI 角色'
}

/** 获取情绪对应的emoji */
function getEmotionEmoji(emotion?: string): string {
  const emojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    curious: '🤔',
    confused: '😕',
    determined: '💪',
  }
  return emojis[emotion || ''] || ''
}
