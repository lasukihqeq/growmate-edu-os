import { describe, it, expect } from 'vitest'
import {
  validateChineseName,
  validatePhone,
  filterChineseOnly,
  filterDigitsOnly,
  getAgeFromDate,
  checkAgeGradeMatch,
} from '../../lib/formValidation'

describe('validateChineseName', () => {
  it('accepts valid 2-character Chinese name', () => {
    const result = validateChineseName('李明')
    expect(result.valid).toBe(true)
  })

  it('accepts valid 3-character Chinese name', () => {
    const result = validateChineseName('张建国')
    expect(result.valid).toBe(true)
  })

  it('accepts valid 4-character Chinese name', () => {
    const result = validateChineseName('欧阳修文')
    expect(result.valid).toBe(true)
  })

  it('rejects single character name', () => {
    const result = validateChineseName('李')
    expect(result.valid).toBe(false)
  })

  it('rejects names longer than 4 characters', () => {
    const result = validateChineseName('abcdefghijklmnop')
    expect(result.valid).toBe(false)
  })

  it('rejects Latin characters', () => {
    const result = validateChineseName('John')
    expect(result.valid).toBe(false)
  })

  it('rejects mixed Chinese and Latin', () => {
    const result = validateChineseName('李Ming')
    expect(result.valid).toBe(false)
  })

  it('rejects numbers in name', () => {
    const result = validateChineseName('李123')
    expect(result.valid).toBe(false)
  })

  it('rejects empty string', () => {
    const result = validateChineseName('')
    expect(result.valid).toBe(false)
  })

  it('rejects whitespace-only string', () => {
    const result = validateChineseName('   ')
    expect(result.valid).toBe(false)
  })

  it('rejects special characters', () => {
    const result = validateChineseName('李@明')
    expect(result.valid).toBe(false)
  })

  it('rejects common spam patterns', () => {
    const result = validateChineseName('测试')
    expect(result.valid).toBe(false)
  })
})

describe('validatePhone', () => {
  it('accepts valid 11-digit Chinese phone starting with 1', () => {
    const result = validatePhone('13912345678')
    expect(result.valid).toBe(true)
  })

  it('accepts valid phone starting with 18', () => {
    const result = validatePhone('18612345678')
    expect(result.valid).toBe(true)
  })

  it('accepts valid phone starting with 15', () => {
    const result = validatePhone('15912345678')
    expect(result.valid).toBe(true)
  })

  it('rejects 10-digit number', () => {
    const result = validatePhone('1391234567')
    expect(result.valid).toBe(false)
  })

  it('rejects 12-digit number', () => {
    const result = validatePhone('139123456789')
    expect(result.valid).toBe(false)
  })

  it('rejects number not starting with 1', () => {
    const result = validatePhone('23912345678')
    expect(result.valid).toBe(false)
  })

  it('rejects empty string', () => {
    const result = validatePhone('')
    expect(result.valid).toBe(false)
  })

  it('rejects non-numeric input', () => {
    const result = validatePhone('139abcd5678')
    expect(result.valid).toBe(false)
  })

  it('rejects phone with spaces', () => {
    const result = validatePhone('139 1234 5678')
    expect(result.valid).toBe(false)
  })
})

describe('filterChineseOnly', () => {
  it('extracts only Chinese characters', () => {
    expect(filterChineseOnly('李明abc123')).toBe('李明')
  })

  it('returns empty for non-Chinese input', () => {
    expect(filterChineseOnly('abc123')).toBe('')
  })

  it('returns same string for pure Chinese', () => {
    expect(filterChineseOnly('王小明')).toBe('王小明')
  })

  it('handles empty string', () => {
    expect(filterChineseOnly('')).toBe('')
  })
})

describe('filterDigitsOnly', () => {
  it('extracts only digits', () => {
    expect(filterDigitsOnly('abc123def456')).toBe('123456')
  })

  it('returns empty for non-numeric input', () => {
    expect(filterDigitsOnly('abcdef')).toBe('')
  })

  it('handles empty string', () => {
    expect(filterDigitsOnly('')).toBe('')
  })

  it('preserves leading zeros', () => {
    expect(filterDigitsOnly('00123abc')).toBe('00123')
  })
})

describe('getAgeFromDate', () => {
  it('calculates correct age for past date', () => {
    const birthDate = new Date()
    birthDate.setFullYear(birthDate.getFullYear() - 10)
    const age = getAgeFromDate(birthDate.toISOString().split('T')[0])
    expect(age).toBe(10)
  })

  it('returns 0 for today', () => {
    const today = new Date().toISOString().split('T')[0]
    expect(getAgeFromDate(today)).toBe(0)
  })

  it('returns positive age for future date calculation', () => {
    const future = new Date()
    future.setFullYear(future.getFullYear() + 5)
    const age = getAgeFromDate(future.toISOString().split('T')[0])
    expect(age).toBeLessThan(0) // future date = negative age difference
  })

  it('returns null for invalid date', () => {
    expect(getAgeFromDate('invalid')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(getAgeFromDate('')).toBeNull()
  })
})

describe('checkAgeGradeMatch', () => {
  it('returns match for correct age-grade (age 7 → 一年级)', () => {
    expect(checkAgeGradeMatch(7, '一年级').status).toBe('match')
  })

  it('returns match for age 10 → 四年级', () => {
    expect(checkAgeGradeMatch(10, '四年级').status).toBe('match')
  })

  it('returns warning for non-exact match but within range', () => {
    // age 5 maps to 幼儿园大班, but 高中 is far off (diff >= 3 → mismatch)
    expect(checkAgeGradeMatch(5, '高三').status).toBe('mismatch')
  })

  it('returns match for age with no recommended grades (default)', () => {
    // Age 3 is not in AGE_GRADE_MAP, returns {status: 'match'}
    expect(checkAgeGradeMatch(3, 'anything').status).toBe('match')
  })

  it('handles negative age (no mapping, returns match by default)', () => {
    const result = checkAgeGradeMatch(-1, '小学')
    expect(result.status).toBe('match') // no recommended grades for -1
  })
})
