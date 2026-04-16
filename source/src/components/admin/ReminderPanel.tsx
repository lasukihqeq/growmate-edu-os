import { useState, useEffect, useCallback } from 'react'
import { getTodayReminders, completeReminder, snoozeReminder } from '../../lib/api'

interface Reminder {
  id: string; title: string; notes: string; remind_at: string
  remind_type: string; status: string; student_name: string
  parent_phone: string; assigned_name: string
}

interface ReminderData {
  overdue: Reminder[]; today: Reminder[]; tomorrow: Reminder[]; total: number
}

export function ReminderPanel() {
  const [data, setData] = useState<ReminderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(true)

  const loadReminders = useCallback(async () => {
    setLoading(true)
    try { setData(await getTodayReminders()) }
    catch { setData(null) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadReminders() }, [loadReminders])

  const handleComplete = async (id: string) => {
    try {
      await completeReminder(id)
      loadReminders()
    } catch (e) { console.error('完成提醒失败:', e) }
  }

  const handleSnooze = async (id: string) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)
    try {
      await snoozeReminder(id, tomorrow.toISOString())
      loadReminders()
    } catch (e) { console.error('延后提醒失败:', e) }
  }

  const totalCount = data ? data.overdue.length + data.today.length + data.tomorrow.length : 0

  const renderItem = (r: Reminder, isOverdue = false) => (
    <div key={r.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
      isOverdue ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100 hover:border-blue-200'
    }`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>{r.title}</span>
          {r.remind_type && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {r.remind_type === 'follow_up_due' ? '跟进' : r.remind_type === 'trial_followup' ? '试课' : r.remind_type === 'renewal_due' ? '续费' : '自定义'}
            </span>
          )}
        </div>
        {r.student_name && <div className="text-xs text-gray-500 mt-0.5">👤 {r.student_name}</div>}
        {r.notes && <div className="text-xs text-gray-400 mt-0.5 truncate">{r.notes}</div>}
        <div className="text-[10px] text-gray-300 mt-1">
          {new Date(r.remind_at).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      <div className="flex gap-1 flex-shrink-0">
        <button onClick={() => handleComplete(r.id)}
          className="text-xs px-2 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">✓</button>
        <button onClick={() => handleSnooze(r.id)}
          className="text-xs px-2 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">⏰</button>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 头部 */}
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔔</span>
          <span className="font-bold text-gray-800 text-sm">待办提醒</span>
          {totalCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white bg-red-500 animate-pulse">
              {totalCount}
            </span>
          )}
        </div>
        <span className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {expanded && (
        <div className="px-5 pb-4 space-y-4">
          {loading ? (
            <div className="text-center py-6 text-gray-400 text-sm animate-pulse">加载中...</div>
          ) : !data || totalCount === 0 ? (
            <div className="text-center py-6">
              <span className="text-3xl block mb-2">✨</span>
              <p className="text-sm text-gray-400">暂无待办提醒</p>
            </div>
          ) : (
            <>
              {data.overdue.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1">
                    ⚠️ 已逾期 ({data.overdue.length})
                  </div>
                  <div className="space-y-2">{data.overdue.map(r => renderItem(r, true))}</div>
                </div>
              )}
              {data.today.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-blue-600 mb-2">📅 今日 ({data.today.length})</div>
                  <div className="space-y-2">{data.today.map(r => renderItem(r))}</div>
                </div>
              )}
              {data.tomorrow.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-gray-500 mb-2">📆 明日 ({data.tomorrow.length})</div>
                  <div className="space-y-2">{data.tomorrow.map(r => renderItem(r))}</div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
