import { useState } from 'react'
import { Phone, Lock, User, ArrowRight, Sparkles, Shield, ChevronLeft } from 'lucide-react'
import { adminLogin, parentLogin, parentRegister } from '../lib/auth'

interface AuthPageProps {
  onLoginSuccess: (role: 'admin' | 'parent') => void
  onSkip?: () => void
}

type AuthMode = 'login' | 'register' | 'admin-login'

export function AuthPage({ onLoginSuccess, onSkip }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [childName, setChildName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'admin-login') {
        const result = adminLogin(phone, password)
        if (result.success) {
          onLoginSuccess('admin')
        } else {
          setError(result.error || '登录失败')
        }
      } else if (mode === 'register') {
        if (!childName.trim()) {
          setError('请输入孩子姓名')
          setLoading(false)
          return
        }
        const result = await parentRegister(phone, password, childName)
        if (result.success) {
          onLoginSuccess('parent')
        } else {
          setError(result.error || '注册失败')
        }
      } else {
        const result = await parentLogin(phone, password)
        if (result.success) {
          onLoginSuccess('parent')
        } else {
          setError(result.error || '登录失败')
        }
      }
    } catch {
      setError('操作失败，请重试')
    }

    setLoading(false)
  }

  const isValidPhone = /^1[3-9]\d{9}$/.test(phone)
  const isValidPassword = password.length >= 6
  const canSubmit = isValidPhone && isValidPassword && (mode !== 'register' || childName.trim())

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex flex-col">
      {/* Header */}
      <div className="p-4">
        {mode !== 'login' && (
          <button
            onClick={() => setMode('login')}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-200">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">GROWMATE · 科创教育入学测评</h1>
          <p className="text-gray-500 text-sm mt-1">科学评估科创天赋，精准匹配教育路径</p>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            {mode === 'login' && '家长登录'}
            {mode === 'register' && '家长注册'}
            {mode === 'admin-login' && '管理员登录'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Input */}
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="请输入手机号"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码（至少6位）"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Child Name (Register Only) */}
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="请输入孩子姓名"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canSubmit || loading}
              className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                canSubmit && !loading
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && '登录'}
                    {mode === 'register' && '注册'}
                    {mode === 'admin-login' && '管理员登录'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Mode Toggle */}
          {mode === 'login' && (
            <div className="mt-6 space-y-3">
              <button
                onClick={() => setMode('register')}
                className="w-full py-3 text-[#2A4CC0] font-medium hover:bg-teal-50 rounded-xl transition-colors"
              >
                还没有账号？立即注册
              </button>
              <button
                onClick={() => setMode('admin-login')}
                className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition-colors flex items-center justify-center gap-1"
              >
                <Shield className="w-4 h-4" />
                管理员入口
              </button>
            </div>
          )}
        </div>

        {/* Skip Option */}
        {onSkip && mode === 'login' && (
          <button
            onClick={onSkip}
            className="mt-6 text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            暂不登录，先体验测评
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-gray-400">
        <p>登录即表示同意《用户协议》和《隐私政策》</p>
      </div>
    </div>
  )
}
