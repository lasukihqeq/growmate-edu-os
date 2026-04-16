import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { parentRegister, parentLogin, migratePasswords } from '../../lib/auth'

describe('auth - SHA-256 password hashing', () => {
  const STORAGE_KEY = 'wilder_parents'

  beforeAll(() => {
    localStorage.removeItem(STORAGE_KEY)
  })

  afterAll(() => {
    localStorage.removeItem(STORAGE_KEY)
  })

  describe('parentRegister', () => {
    it('registers new user successfully', async () => {
      const result = await parentRegister('13912345678', 'SecurePass123', 'Child1')
      expect(result.success).toBe(true)
    })

    it('stores hashed password (not plaintext)', async () => {
      await parentRegister('13900000001', 'MySecret', 'Child2')
      const accounts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      const user = accounts.find((a: any) => a.phone === '13900000001')
      expect(user.password).not.toBe('MySecret')
      expect(user.password.length).toBe(64) // SHA-256 hex length
    })

    it('rejects duplicate registration', async () => {
      await parentRegister('13900000002', 'Pass1', 'Child3')
      const result = await parentRegister('13900000002', 'Pass2', 'Child4')
      expect(result.success).toBe(false)
    })

    it('includes timestamp', async () => {
      await parentRegister('13900000003', 'Pass1', 'Child5')
      const accounts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      const user = accounts.find((a: any) => a.phone === '13900000003')
      expect(user.createdAt).toBeDefined()
    })

    it('produces SHA-256 hash (64 hex chars)', async () => {
      await parentRegister('13900000004', 'TestHash', 'Child6')
      const accounts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      const user = accounts.find((a: any) => a.phone === '13900000004')
      expect(user.password).toMatch(/^[0-9a-f]{64}$/)
    })
  })

  describe('parentLogin', () => {
    beforeAll(async () => {
      localStorage.removeItem(STORAGE_KEY)
      await parentRegister('13911111111', 'CorrectPassword', 'Child7')
    })

    it('logs in with correct credentials', async () => {
      const result = await parentLogin('13911111111', 'CorrectPassword')
      expect(result.success).toBe(true)
    })

    it('rejects wrong password', async () => {
      const result = await parentLogin('13911111111', 'WrongPassword')
      expect(result.success).toBe(false)
    })

    it('rejects non-existent user', async () => {
      const result = await parentLogin('13999999999', 'AnyPassword')
      expect(result.success).toBe(false)
    })

    it('is case-sensitive for password', async () => {
      const result = await parentLogin('13911111111', 'correctpassword')
      expect(result.success).toBe(false)
    })
  })

  describe('migratePasswords', () => {
    it('migrates old-format passwords to SHA-256', async () => {
      localStorage.removeItem(STORAGE_KEY)
      // Simulate old Base64-encoded password
      const oldAccounts = [
        { phone: '13922222222', password: btoa('OldPassword'), createdAt: new Date().toISOString() }
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(oldAccounts))

      await migratePasswords()

      // Verify password is now SHA-256 format
      const accounts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      const user = accounts.find((a: any) => a.phone === '13922222222')
      expect(user.password.length).toBe(64)
    })

    it('handles empty storage', async () => {
      localStorage.removeItem(STORAGE_KEY)
      // Should not throw
      await expect(migratePasswords()).resolves.not.toThrow()
    })
  })
})
