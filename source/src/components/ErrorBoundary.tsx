import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

interface FallbackProps {
  error: Error | null
  errorInfo: ErrorInfo | null
  resetError: () => void
}

/**
 * 全局错误边界组件
 * 捕获子组件的 JavaScript 错误，防止整个应用崩溃
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 记录错误到控制台（生产环境可上报到错误追踪服务）
    console.error('[ErrorBoundary] 捕获到错误:', error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // 可选：上报到错误追踪服务
    // reportError(error, errorInfo)
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // 如果有自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback
      }

      // 默认错误 UI
      return (
        <DefaultFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      )
    }

    return this.props.children
  }
}

/**
 * 默认错误显示组件
 */
function DefaultFallback({ error, errorInfo, resetError }: FallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgba(59,95,217,0.04)] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-xl font-bold text-[#0A0A1A] mb-2">
          出现了一些问题
        </h1>

        <p className="text-[rgba(10,10,26,0.5)] mb-6">
          抱歉，页面遇到了意外错误。请尝试刷新页面或返回首页。
        </p>

        {/* 开发环境显示错误详情 */}
        {import.meta.env.DEV && error && (
          <div className="text-left bg-[rgba(59,95,217,0.06)] rounded-lg p-4 mb-6 text-xs font-mono overflow-auto max-h-40">
            <p className="font-semibold text-red-600 mb-2">{error.message}</p>
            {errorInfo?.componentStack && (
              <pre className="text-[rgba(10,10,26,0.5)] whitespace-pre-wrap">
                {errorInfo.componentStack}
              </pre>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={resetError}
            className="px-6 py-2 bg-brand-blue-500 text-white rounded-lg font-medium hover:bg-brand-blue-600 transition-colors"
          >
            重试
          </button>

          <button
            onClick={() => {
              window.location.hash = ''
              window.location.reload()
            }}
            className="px-6 py-2 bg-[rgba(59,95,217,0.06)] text-[rgba(10,10,26,0.6)] rounded-lg font-medium hover:bg-[rgba(59,95,217,0.08)] transition-colors"
          >
            刷新页面
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorBoundary
