// ===================================================================
// 增强版信息收集页面 v3.0
// 集成：省市区联动、日历选择、学校搜索、格式提示
// ===================================================================

import { useState, useCallback, useMemo } from 'react'
import { ArrowRight, User, Sparkles, Loader2, CheckCircle } from 'lucide-react'
import { FloatingInput } from './ui/FloatingInput'
import { FloatingSelect } from './ui/FloatingSelect'
import { RegionSelector } from './ui/RegionSelector'
import { BirthdayPicker } from './ui/BirthdayPicker'
import { SchoolSearch } from './ui/SchoolSearch'
import { WilderLogo } from './ui/WilderLogo'
import { validateChineseName, validatePhone, validateBirthday, getAgeFromDate, filterChineseOnly, filterDigitsOnly, getRecommendedGrades, checkAgeGradeMatch } from '../lib/formValidation'
import { type RegionValue } from '../lib/regionData'
import type { SchoolItem } from '../lib/schoolData'
import type { StudentInfo } from '../types'

interface OnboardingProps {
  onComplete: (info: StudentInfo) => void
  onBack?: () => void
}

// ========== 常量 ==========

const GRADE_OPTIONS = [
  { value: '', label: '选择年级' },
  { value: '幼儿园小班', label: '幼儿园小班' },
  { value: '幼儿园中班', label: '幼儿园中班' },
  { value: '幼儿园大班', label: '幼儿园大班' },
  { value: '一年级', label: '一年级' },
  { value: '二年级', label: '二年级' },
  { value: '三年级', label: '三年级' },
  { value: '四年级', label: '四年级' },
  { value: '五年级', label: '五年级' },
  { value: '六年级', label: '六年级' },
  { value: '初一', label: '初一' },
  { value: '初二', label: '初二' },
  { value: '初三', label: '初三' },
  { value: '高一', label: '高一' },
  { value: '高二', label: '高二' },
  { value: '高三', label: '高三' },
]

// ========== 主组件 ==========

export function Onboarding({ onComplete, onBack }: OnboardingProps) {
  // 表单状态
  const [name, setName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [age, setAge] = useState<number | ''>('')
  const [grade, setGrade] = useState('')
  const [phone, setPhone] = useState('')
  const [region, setRegion] = useState<RegionValue>({})
  const [school, setSchool] = useState('')
  const [schoolCategory, setSchoolCategory] = useState('')

  // 验证状态
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [warnings, setWarnings] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 生日变化时自动计算年龄
  const handleBirthdayChange = useCallback((value: string) => {
    setBirthday(value)

    if (value) {
      const result = validateBirthday(value)
      if (!result.valid) {
        setErrors(prev => ({ ...prev, birthday: result.error! }))
        return
      }

      const calculatedAge = getAgeFromDate(value)
      if (calculatedAge !== null) {
        setAge(calculatedAge)
        setErrors(prev => {
          const next = { ...prev }
          delete next.birthday
          return next
        })

        // 推荐年级
        const recommended = getRecommendedGrades(calculatedAge)
        if (grade && !recommended.includes(grade)) {
          setWarnings(prev => ({
            ...prev,
            grade: `${calculatedAge}岁通常对应${recommended.join('或')}`,
          }))
        } else {
          setWarnings(prev => {
            const next = { ...prev }
            delete next.grade
            return next
          })
        }
      }
    } else {
      setAge('')
      setErrors(prev => {
        const next = { ...prev }
        delete next.birthday
        return next
      })
    }
  }, [grade])

  // 年级变化
  const handleGradeChange = useCallback((value: string) => {
    setGrade(value)

    if (typeof age === 'number' && value) {
      const match = checkAgeGradeMatch(age, value)
      if (match.status === 'warning' || match.status === 'mismatch') {
        setWarnings(prev => ({ ...prev, grade: match.message! }))
      } else {
        setWarnings(prev => {
          const next = { ...prev }
          delete next.grade
          return next
        })
      }
    } else {
      setWarnings(prev => {
        const next = { ...prev }
        delete next.grade
        return next
      })
    }
  }, [age])

  // 手机号实时格式验证
  const handlePhoneChange = useCallback((raw: string) => {
    const filtered = filterDigitsOnly(raw, 11)
    setPhone(filtered)

    if (filtered && filtered.length === 11) {
      const result = validatePhone(filtered)
      if (!result.valid) {
        setErrors(prev => ({ ...prev, phone: result.error! }))
      } else {
        setErrors(prev => {
          const next = { ...prev }
          delete next.phone
          return next
        })
      }
    } else if (filtered && filtered.length > 0) {
      setErrors(prev => ({ ...prev, phone: `已输入${filtered.length}/11位` }))
    } else {
      setErrors(prev => {
        const next = { ...prev }
        delete next.phone
        return next
      })
    }
  }, [])

  // 姓名实时验证
  const handleNameChange = useCallback((raw: string) => {
    const filtered = filterChineseOnly(raw)
    setName(filtered)

    if (filtered.length >= 2) {
      const result = validateChineseName(filtered)
      if (!result.valid) {
        setErrors(prev => ({ ...prev, name: result.error! }))
      } else {
        setErrors(prev => {
          const next = { ...prev }
          delete next.name
          return next
        })
      }
    } else {
      setErrors(prev => {
        const next = { ...prev }
        delete next.name
        return next
      })
    }
  }, [])

  // 学校选择
  const handleSchoolSelect = useCallback((_school: SchoolItem | null) => {
    // school name already set via onChange
  }, [])

  // 验证
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    // 姓名验证
    const nameResult = validateChineseName(name)
    if (!nameResult.valid) newErrors.name = nameResult.error!

    // 生日/年龄验证
    if (!age && !birthday) {
      newErrors.birthday = '请选择出生日期'
    } else if (birthday) {
      const bdayResult = validateBirthday(birthday)
      if (!bdayResult.valid) newErrors.birthday = bdayResult.error!
    } else if (typeof age !== 'number' || age < 4 || age > 18) {
      newErrors.birthday = '年龄应在4-18岁之间'
    }

    // 手机号验证（选填，但填了就验证）
    if (phone) {
      const phoneResult = validatePhone(phone)
      if (!phoneResult.valid) newErrors.phone = phoneResult.error!
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [name, age, birthday, phone])

  // 提交
  const handleSubmit = useCallback(async () => {
    if (!validate()) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    const info: StudentInfo = {
      name: name.trim(),
      age: typeof age === 'number' ? age : 0,
      birthday: birthday || undefined,
      grade: grade || undefined,
      phone: phone || undefined,
      school: school || undefined,
      province: region.province || undefined,
      city: region.city || undefined,
      district: region.district || undefined,
      schoolCategory: schoolCategory || undefined,
      testDate: new Date().toISOString().split('T')[0],
    }

    try {
      localStorage.setItem('GROWMATE_STUDENT_INFO', JSON.stringify(info))
    } catch (e) {
      console.warn('Failed to save student info:', e)
    }

    setIsSubmitting(false)
    onComplete(info)
  }, [validate, name, age, birthday, grade, phone, school, region, schoolCategory, onComplete])

  // 恢复草稿
  useMemo(() => {
    try {
      const saved = localStorage.getItem('GROWMATE_STUDENT_INFO')
      if (saved) {
        const info: StudentInfo = JSON.parse(saved)
        if (info.name) setName(info.name)
        if (info.age) setAge(info.age)
        if (info.birthday) setBirthday(info.birthday)
        if (info.grade) setGrade(info.grade)
        if (info.phone) setPhone(info.phone)
        if (info.school) setSchool(info.school)
        if (info.schoolCategory) setSchoolCategory(info.schoolCategory)
        if (info.province || info.city || info.district) {
          setRegion({
            province: info.province,
            city: info.city,
            district: info.district,
          })
        }
      }
    } catch (e) {
      console.warn('Failed to load draft:', e)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#3B5FD9]/10 to-[#0F9D94]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[#FFB800]/10 to-[#3B5FD9]/10 rounded-full blur-3xl" />
      </div>

      {/* 主卡片 */}
      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <WilderLogo variant="auto" size="lg" className="mx-auto" />
        </div>

        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50 overflow-hidden">
          {/* 头部 */}
          <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-[#3B5FD9]/5 to-[#0F9D94]/5 dark:from-[#3B5FD9]/10 dark:to-[#0F9D94]/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B5FD9] to-[#0F9D94] flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  学生信息
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  请填写孩子基本信息，仅需1分钟
                </p>
              </div>
            </div>
          </div>

          {/* 表单 */}
          <div className="px-8 py-6 space-y-5">
            {/* 姓名 */}
            <div>
              <FloatingInput
                label="孩子姓名"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                error={errors.name}
                helperText="请输入真实姓名，限2-4个汉字"
                type="text"
                maxLength={20}
                success={name.length >= 2 && !errors.name}
              />
            </div>

            {/* 出生日期 + 年龄 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <BirthdayPicker
                  value={birthday}
                  onChange={handleBirthdayChange}
                  error={errors.birthday}
                  helperText="选填，自动计算年龄"
                />
              </div>
              <div>
                <FloatingInput
                  label="年龄"
                  value={typeof age === 'number' ? `${age}岁` : ''}
                  onChange={() => {}}
                  readOnly
                  helperText={birthday ? '由出生日期自动计算' : '请先选择出生日期'}
                  className="bg-slate-50 dark:bg-slate-700/30"
                />
              </div>
            </div>

            {/* 年级 */}
            <div>
              <FloatingSelect
                label="年级"
                value={grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                options={GRADE_OPTIONS.filter(opt => opt.value !== '')}
                error={errors.grade}
                helperText={warnings.grade || '选填，根据年龄推荐'}
              />
              {warnings.grade && (
                <p className="mt-1 text-xs text-amber-500 px-1">{warnings.grade}</p>
              )}
            </div>

            {/* 所在地区 */}
            <div>
              <RegionSelector
                value={region}
                onChange={setRegion}
                error={errors.region}
              />
            </div>

            {/* 学校信息 */}
            <div>
              <SchoolSearch
                value={school}
                onChange={setSchool}
                onSelect={handleSchoolSelect}
                province={region.province}
                city={region.city}
                schoolCategory={schoolCategory}
                onCategoryChange={setSchoolCategory}
                error={errors.school}
              />
            </div>

            {/* 手机号 */}
            <div>
              <FloatingInput
                label="手机号码"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                error={errors.phone}
                helperText="请输入11位手机号码"
                type="tel"
                maxLength={11}
                success={phone.length === 11 && !errors.phone}
              />
            </div>
          </div>

          {/* 底部操作区 */}
          <div className="px-8 pb-8">
            {/* 功能说明 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#3B5FD9] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p className="font-medium text-slate-800 dark:text-slate-300 mb-1">
                    信息仅用于生成评估报告
                  </p>
                  <p>
                    我们将根据孩子年龄自适应调整评估内容，确保测评准确有效。
                  </p>
                </div>
              </div>
            </div>

            {/* 按钮 */}
            <div className="flex gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-6 py-3.5 border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  返回
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3.5 px-6 bg-gradient-to-r from-[#3B5FD9] to-[#0F9D94] text-white rounded-xl font-bold text-base shadow-lg shadow-[#3B5FD9]/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    开始评估
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* 底部提示 */}
            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
              评估约需 8-10 分钟 · 支持中途暂停
            </p>
          </div>
        </div>

        {/* 安全标识 */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <CheckCircle className="w-4 h-4" />
            <span>数据安全加密 · 隐私保护</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
