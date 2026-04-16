// 骨架屏组件 - 用于加载状态展示
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-[rgba(59,95,217,0.08)] rounded ${className}`} />
  )
}

export function ReportSkeleton() {
  return (
    <div className="min-h-screen bg-[rgba(59,95,217,0.04)] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 顶部导航骨架 */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="w-32 h-10 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>

        {/* 总览卡片骨架 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-32 h-6" />
              <Skeleton className="w-48 h-4" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[rgba(59,95,217,0.04)] rounded-xl p-4">
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-2/3 h-6" />
              </div>
            ))}
          </div>
        </div>

        {/* 能力图表骨架 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <Skeleton className="w-40 h-6 mb-6" />
          <div className="flex justify-center">
            <Skeleton className="w-64 h-64 rounded-full" />
          </div>
        </div>

        {/* 内容区块骨架 */}
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <Skeleton className="w-48 h-6 mb-4" />
            <div className="space-y-3">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-5/6 h-4" />
              <Skeleton className="w-4/6 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* 底部加载提示 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-lg flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[rgba(10,10,26,0.6)]">正在生成报告...</span>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-[rgba(59,95,217,0.08)] rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[rgba(59,95,217,0.08)] rounded w-24" />
          <div className="h-3 bg-[rgba(59,95,217,0.08)] rounded w-32" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-[rgba(59,95,217,0.08)] rounded" />
        <div className="h-3 bg-[rgba(59,95,217,0.08)] rounded w-5/6" />
      </div>
    </div>
  )
}
