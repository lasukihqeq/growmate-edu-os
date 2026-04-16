import { useState, useEffect } from 'react'
import { getStudentGrowthTimeline } from '../../lib/api'

interface TimelineEvent {
  type: 'assessment' | 'intervention' | 'follow_up'
  date: string
  title: string
  description: string
  data?: Record<string, unknown>
}

interface Props {
  studentId: string
  studentName: string
}

const TYPE_CONFIG = {
  assessment: { icon: '📊', label: '测评', color: '#0d9488', bg: '#f0fdfa' },
  intervention: { icon: '📚', label: '课程', color: '#7c3aed', bg: '#f5f3ff' },
  follow_up: { icon: '📞', label: '跟进', color: '#2563eb', bg: '#eff6ff' },
}

export function StudentTimeline({ studentId, studentName }: Props) {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTimeline()
  }, [studentId])

  const loadTimeline = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getStudentGrowthTimeline(studentId)
      setEvents(data.timeline || [])
    } catch (err) {
      setError('加载时间线失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        <span className="animate-pulse">加载成长时间线...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        {error}
        <button onClick={loadTimeline} className="ml-2 text-[#2A4CC0] underline">重试</button>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-4xl mb-4 block">📭</span>
        <p className="text-gray-400">暂无成长记录</p>
        <p className="text-sm text-gray-300 mt-1">{studentName}的成长旅程即将开启</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>🌱</span>
        {studentName} 的成长时间线
      </h3>

      {/* 时间线 */}
      <div className="relative pl-8">
        {/* 竖线 */}
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200" />

        {events.map((event, i) => {
          const config = TYPE_CONFIG[event.type] || TYPE_CONFIG.follow_up
          return (
            <div key={i} className="relative mb-6 last:mb-0">
              {/* 节点圆点 */}
              <div 
                className="absolute -left-5 w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 border-white shadow-sm"
                style={{ background: config.bg, color: config.color }}
              >
                {config.icon}
              </div>

              {/* 内容卡片 */}
              <div 
                className="rounded-xl p-4 border transition-all hover:shadow-md"
                style={{ background: config.bg, borderColor: config.color + '30' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: config.color + '20', color: config.color }}
                  >
                    {config.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(event.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <h4 className="font-medium text-gray-800 text-sm mb-1">{event.title}</h4>
                {event.description && (
                  <p className="text-xs text-gray-500 leading-relaxed">{event.description}</p>
                )}

                {/* 测评维度分数 */}
                {event.type === 'assessment' && event.data && (
                  <div className="mt-3 grid grid-cols-6 gap-2">
                    {['W', 'I', 'L', 'D', 'E', 'R'].map(dim => {
                      const score = (event.data as Record<string, number>)?.[`score_${dim.toLowerCase()}`] || 0
                      return (
                        <div key={dim} className="text-center">
                          <div className="text-xs text-gray-400">{dim}</div>
                          <div className="text-sm font-bold" style={{ color: config.color }}>{Math.round(score)}</div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* 课程进度 */}
                {event.type === 'intervention' && event.data?.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>课程进度</span>
                      <span>{event.data.progress as number}%</span>
                    </div>
                    <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${event.data.progress as number}%`, background: config.color }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
