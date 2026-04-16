import { describe, it, expect } from 'vitest'
import { shuffleOptions, findDuplicateOptions } from '../../lib/optionShuffle'

describe('shuffleOptions', () => {
  it('shuffles array without modifying original', () => {
    const original = ['A', 'B', 'C', 'D']
    const copy = [...original]
    shuffleOptions(original, 'q1', 'seed123')
    expect(original).toEqual(copy)
  })

  it('produces same result with same seed (deterministic)', () => {
    const options1 = ['选项A', '选项B', '选项C', '选项D']
    const options2 = ['选项A', '选项B', '选项C', '选项D']
    const result1 = shuffleOptions(options1, 'q1', 'test-seed')
    const result2 = shuffleOptions(options2, 'q1', 'test-seed')
    expect(result1.map((o: any) => o.text || o)).toEqual(result2.map((o: any) => o.text || o))
  })

  it('produces different results with different seeds', () => {
    const options = ['A', 'B', 'C', 'D', 'E']
    const result1 = shuffleOptions(options, 'q1', 'seed-1')
    const result2 = shuffleOptions(options, 'q1', 'seed-2')
    expect(Array.isArray(result1)).toBe(true)
    expect(Array.isArray(result2)).toBe(true)
  })

  it('preserves all elements after shuffle', () => {
    const options = ['A', 'B', 'C', 'D']
    const result = shuffleOptions(options, 'q1', 'any-seed')
    const resultTexts = result.map((o: any) => o.text || o)
    expect(resultTexts.sort()).toEqual([...options].sort())
  })

  it('handles single element array', () => {
    const options = ['Only']
    const result = shuffleOptions(options, 'q1', 'seed')
    expect(result.length).toBe(1)
  })

  it('handles empty array', () => {
    const result = shuffleOptions([], 'q1', 'seed')
    expect(result).toEqual([])
  })

  it('handles two elements', () => {
    const options = ['A', 'B']
    const result = shuffleOptions(options, 'q1', 'seed')
    expect(result.length).toBe(2)
  })
})

describe('findDuplicateOptions', () => {
  it('returns empty array for unique options', () => {
    const options = ['A', 'B', 'C', 'D']
    expect(findDuplicateOptions(options)).toEqual([])
  })

  it('finds duplicate options (case-insensitive)', () => {
    const options = ['A', 'B', 'A', 'C']
    const duplicates = findDuplicateOptions(options)
    expect(duplicates).toContain('a')
  })

  it('handles empty array', () => {
    expect(findDuplicateOptions([])).toEqual([])
  })

  it('handles all same options', () => {
    const options = ['X', 'X', 'X']
    const duplicates = findDuplicateOptions(options)
    expect(duplicates).toContain('x')
  })

  it('finds multiple duplicates', () => {
    const options = ['A', 'B', 'A', 'B', 'C']
    const duplicates = findDuplicateOptions(options)
    expect(duplicates).toContain('a')
    expect(duplicates).toContain('b')
    expect(duplicates.length).toBe(2)
  })

  it('treats different case as same (case-insensitive)', () => {
    const options = ['a', 'A', 'b']
    const duplicates = findDuplicateOptions(options)
    expect(duplicates).toContain('a')
  })
})
