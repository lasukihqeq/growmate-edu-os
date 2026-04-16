import { useState, useEffect } from 'react'

/**
 * 404 页面组件
 * 处理未匹配的路由
 */
export function NotFound() {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.hash = ''
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 数字 */}
        <div className="text-8xl font-black text-[rgba(10,10,26,0.1)] mb-4 select-none">
          404
        </div>

        {/* 标题 */}
        <h1 className="text-2xl font-bold text-[#0A0A1A] mb-3">
          页面未找到
        </h1>

        {/* 描述 */}
        <p className="text-[rgba(10,10,26,0.5)] mb-8">
          抱歉，您访问的页面不存在或已被移除。
          <br />
          正在为您跳转到首页...
        </p>

        {/* 倒计时提示 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue-50 rounded-full text-brand-blue-600 text-sm font-medium mb-8">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {countdown} 秒后自动跳转
        </div>

        {/* 快捷链接 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              window.location.hash = ''
              window.location.reload()
            }}
            className="px-6 py-3 bg-brand-blue-500 text-white rounded-xl font-medium hover:bg-brand-blue-600 transition-colors shadow-lg shadow-brand-blue-500/25"
          >
            返回首页
          </button>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-white text-[rgba(10,10,26,0.6)] border border-[rgba(10,10,26,0.06)] rounded-xl font-medium hover:bg-[rgba(59,95,217,0.04)] transition-colors"
          >
            返回上页
          </button>
        </div>

        {/* 帮助链接 */}
        <p className="mt-8 text-sm text-[rgba(10,10,26,0.35)]">
          需要帮助？{' '}
          <a
            href="https://work.weixin.qq.com/kfid/XXX"
            className="text-brand-blue-500 hover:underline"
          >
            联系客服
          </a>
        </p>
      </div>
    </div>
  )
}

export default NotFound
