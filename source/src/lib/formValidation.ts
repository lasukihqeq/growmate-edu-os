/**
 * 信息采集共享验证模块
 * Home.tsx 和 Onboarding.tsx 共用的常量、验证函数
 */

// ========== 常量 ==========

export const AGES: number[] = Array.from({ length: 15 }, (_, i) => i + 4)

export const GRADES: string[] = [
  '幼儿园中班', '幼儿园大班',
  '一年级', '二年级', '三年级', '四年级', '五年级', '六年级',
  '初一', '初二', '初三',
  '高一', '高二', '高三',
]

export const AGE_GRADE_MAP: Record<number, string[]> = {
  4: ['幼儿园中班'],
  5: ['幼儿园大班'],
  6: ['一年级'],
  7: ['一年级', '二年级'],
  8: ['二年级', '三年级'],
  9: ['三年级', '四年级'],
  10: ['四年级', '五年级'],
  11: ['五年级', '六年级'],
  12: ['六年级', '初一'],
  13: ['初一', '初二'],
  14: ['初二', '初三'],
  15: ['初三', '高一'],
  16: ['高一', '高二'],
  17: ['高二', '高三'],
  18: ['高三'],
}

export const SPAM_NAME_PATTERNS: string[] = [
  '测试', 'test', 'admin', '管理员', '用户', 'guest', '匿名', '未知',
  '张三', '李四', '王五', '赵六', '小明', '小红', '小刚', '小芳',
  '阿猫', '阿狗', '某人', '某某', '孩子', '学生',
  'aaa', 'bbb', 'ccc', 'xxx', 'yyy', 'zzz', 'qqq', 'www',
]

// ========== 类型 ==========

export interface ValidationResult {
  valid: boolean
  error?: string
}

export interface AgeGradeMatchResult {
  status: 'match' | 'warning' | 'mismatch'
  message?: string
}

// ========== 验证函数 ==========

/** 验证中文姓名：2-4个汉字 + 垃圾词过滤 + 重复字检测 */
export function validateChineseName(name: string): ValidationResult {
  const trimmed = name.trim()
  if (!trimmed) return { valid: false, error: '请输入孩子姓名' }
  if (trimmed.length < 2) return { valid: false, error: '姓名至少2个字' }
  if (trimmed.length > 4) return { valid: false, error: '姓名最多4个字' }
  if (!/^[\u4e00-\u9fa5]+$/.test(trimmed)) {
    return { valid: false, error: '请输入中文姓名' }
  }
  const lowerName = trimmed.toLowerCase()
  for (const pattern of SPAM_NAME_PATTERNS) {
    if (lowerName.includes(pattern.toLowerCase())) {
      return { valid: false, error: '请输入真实的姓名' }
    }
  }
  if (/^(.)\1+$/.test(trimmed)) {
    return { valid: false, error: '请输入真实的姓名' }
  }
  return { valid: true }
}

/** 过滤非汉字字符（保留拼音字母以支持输入法） */
export function filterChineseOnly(value: string): string {
  // 允许汉字、拼音字母(a-z, A-Z)、空格（输入法候选词分隔符）
  // 过滤掉数字、特殊符号等无关字符
  return value.replace(/[^\u4e00-\u9fa5a-zA-Z\s]/g, '')
}

/** 验证手机号：11位中国手机号 */
export function validatePhone(phone: string): ValidationResult {
  const trimmed = phone.trim()
  if (!trimmed) return { valid: false, error: '请输入手机号' }
  if (!/^1[3-9]\d{9}$/.test(trimmed)) {
    return { valid: false, error: '请输入正确的11位手机号' }
  }
  return { valid: true }
}

/** 只保留数字，限制长度 */
export function filterDigitsOnly(value: string, maxLen = 11): string {
  return value.replace(/\D/g, '').slice(0, maxLen)
}

/** 从生日日期计算年龄 */
export function getAgeFromDate(birthday: string): number | null {
  if (!birthday) return null
  const birthDate = new Date(birthday)
  if (isNaN(birthDate.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

/** 验证出生日期 */
export function validateBirthday(birthday: string): ValidationResult {
  if (!birthday) return { valid: false, error: '请选择出生日期' }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(birthday)) {
    return { valid: false, error: '日期格式：YYYY-MM-DD' }
  }

  const birthDate = new Date(birthday)
  if (isNaN(birthDate.getTime())) {
    return { valid: false, error: '请输入有效日期' }
  }

  const age = getAgeFromDate(birthday)
  if (age === null || age < 4 || age > 18) {
    return { valid: false, error: '年龄应在4-18岁之间' }
  }

  // 不能是未来日期
  const today = new Date()
  if (birthDate > today) {
    return { valid: false, error: '出生日期不能是未来' }
  }

  return { valid: true }
}

/** 验证地区选择（省份必选，城市和区县可选） */
export function validateRegion(province?: string): ValidationResult {
  if (!province) return { valid: true } // 地区非必填
  return { valid: true }
}

/** 验证学校名称（选填，但如果填写则不能太短） */
export function validateSchoolName(school: string): ValidationResult {
  if (!school) return { valid: true } // 学校非必填
  const trimmed = school.trim()
  if (trimmed.length < 2) return { valid: false, error: '学校名称至少2个字' }
  if (trimmed.length > 30) return { valid: false, error: '学校名称不超过30个字' }
  return { valid: true }
}

/** 根据年龄返回推荐年级列表 */
export function getRecommendedGrades(age: number): string[] {
  return AGE_GRADE_MAP[age] || []
}

/** 检查年龄与年级匹配度 */
export function checkAgeGradeMatch(age: number, grade: string): AgeGradeMatchResult {
  const recommended = getRecommendedGrades(age)
  if (recommended.length === 0) return { status: 'match' }
  if (recommended.includes(grade)) return { status: 'match' }

  const gradeIdx = GRADES.indexOf(grade)
  const expectedMinAge = gradeIdx + 4
  const diff = Math.abs(age - expectedMinAge)

  if (diff >= 3) {
    return {
      status: 'mismatch',
      message: `${age}岁选择"${grade}"差异较大，请确认是否正确`,
    }
  }
  return {
    status: 'warning',
    message: `${age}岁通常对应${recommended.join('或')}`,
  }
}
