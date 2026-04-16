import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import {
  generateTokenBatch,
  validateInviteCode,
  useInviteCode,
  validateProToken,
  useProToken,
  getTokenStats,
  getTokenBatches,
  clearAllOneTimeTokens,
} from '../../lib/tokenManager'

describe('tokenManager', () => {
  const STORAGE_KEYS = {
    ONE_TIME_TOKENS: 'wilder_one_time_tokens',
    TOKEN_BATCHES: 'wilder_token_batches',
  }

  beforeAll(() => {
    // Clean storage before tests
    localStorage.removeItem(STORAGE_KEYS.ONE_TIME_TOKENS)
    localStorage.removeItem(STORAGE_KEYS.TOKEN_BATCHES)
  })

  afterAll(() => {
    // Clean up after tests
    localStorage.removeItem(STORAGE_KEYS.ONE_TIME_TOKENS)
    localStorage.removeItem(STORAGE_KEYS.TOKEN_BATCHES)
  })

  describe('generateTokenBatch', () => {
    it('generates correct number of invite tokens', () => {
      clearAllOneTimeTokens()
      const batch = generateTokenBatch('invite', 10)
      expect(batch.tokens.length).toBe(10)
      expect(batch.type).toBe('invite')
    })

    it('generates correct number of pro tokens', () => {
      clearAllOneTimeTokens()
      const batch = generateTokenBatch('pro', 5)
      expect(batch.tokens.length).toBe(5)
      expect(batch.type).toBe('pro')
    })

    it('generates unique tokens', () => {
      clearAllOneTimeTokens()
      const batch = generateTokenBatch('invite', 20)
      const uniqueTokens = new Set(batch.tokens.map(t => t.token))
      expect(uniqueTokens.size).toBe(20)
    })

    it('tokens have correct initial state', () => {
      clearAllOneTimeTokens()
      const batch = generateTokenBatch('invite', 3)
      batch.tokens.forEach(token => {
        expect(token.isValid).toBe(true)
        expect(token.usedAt).toBeUndefined()
        expect(token.createdAt).toBeDefined()
      })
    })

    it('creates batch record', () => {
      clearAllOneTimeTokens()
      generateTokenBatch('invite', 5)
      const batches = getTokenBatches()
      expect(batches.length).toBeGreaterThan(0)
    })
  })

  describe('validateInviteCode', () => {
    beforeAll(() => {
      clearAllOneTimeTokens()
      generateTokenBatch('invite', 10)
    })

    it('validates existing one-time token', () => {
      const tokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.ONE_TIME_TOKENS) || '[]')
      const validToken = tokens.find((t: any) => t.type === 'invite' && t.isValid)
      if (validToken) {
        const result = validateInviteCode(validToken.token)
        expect(result.valid).toBe(true)
      }
    })

    it('rejects invalid token', () => {
      const result = validateInviteCode('INVALID-CODE')
      expect(result.valid).toBe(false)
    })

    it('rejects empty token', () => {
      const result = validateInviteCode('')
      expect(result.valid).toBe(false)
    })

    it('does not accept hardcoded tokens (security)', () => {
      // After security fix, these should not be accepted by default
      // They're now env-dependent
      const envCode = import.meta.env.VITE_FIXED_INVITE_CODE
      if (!envCode) {
        const result = validateInviteCode('huangyekexue2017')
        expect(result.valid).toBe(false)
      }
    })
  })

  describe('useInviteCode', () => {
    beforeAll(() => {
      clearAllOneTimeTokens()
      generateTokenBatch('invite', 10)
    })

    it('marks token as used', () => {
      const tokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.ONE_TIME_TOKENS) || '[]')
      const validToken = tokens.find((t: any) => t.type === 'invite' && t.isValid)
      if (validToken) {
        const result = useInviteCode(validToken.token, 'test-user')
        expect(result).toBe(true)
        // Verify it's now invalid
        const validation = validateInviteCode(validToken.token)
        expect(validation.valid).toBe(false)
      }
    })

    it('records usage info', () => {
      const tokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.ONE_TIME_TOKENS) || '[]')
      const validToken = tokens.find((t: any) => t.type === 'invite' && t.isValid)
      if (validToken) {
        useInviteCode(validToken.token, 'user-123')
        const updatedTokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.ONE_TIME_TOKENS) || '[]')
        const usedToken = updatedTokens.find((t: any) => t.token === validToken.token)
        expect(usedToken.isValid).toBe(false)
        expect(usedToken.usedBy).toBe('user-123')
        expect(usedToken.usedAt).toBeDefined()
      }
    })

    it('returns false for non-existent token', () => {
      const result = useInviteCode('FAKE-TOKEN', 'user')
      expect(result).toBe(false)
    })
  })

  describe('validateProToken', () => {
    beforeAll(() => {
      clearAllOneTimeTokens()
      generateTokenBatch('pro', 10)
    })

    it('validates WILDER PRO fixed token', () => {
      const result = validateProToken('WILDER PRO')
      expect(result.valid).toBe(true)
      expect(result.isOneTime).toBe(false)
    })

    it('validates pro token case-insensitively', () => {
      const result = validateProToken('wilder pro')
      expect(result.valid).toBe(true)
    })

    it('validates one-time pro token', () => {
      const tokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.ONE_TIME_TOKENS) || '[]')
      const validToken = tokens.find((t: any) => t.type === 'pro' && t.isValid)
      if (validToken) {
        const result = validateProToken(validToken.token)
        expect(result.valid).toBe(true)
      }
    })

    it('rejects invalid pro token', () => {
      const result = validateProToken('INVALID')
      expect(result.valid).toBe(false)
    })
  })

  describe('useProToken', () => {
    beforeAll(() => {
      clearAllOneTimeTokens()
      generateTokenBatch('pro', 5)
    })

    it('marks one-time pro token as used', () => {
      const tokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.ONE_TIME_TOKENS) || '[]')
      const validToken = tokens.find((t: any) => t.type === 'pro' && t.isValid)
      if (validToken) {
        const result = useProToken(validToken.token, 'admin-user')
        expect(result).toBe(true)
      }
    })

    it('does not mark WILDER PRO as used', () => {
      const result = useProToken('WILDER PRO', 'user')
      expect(result).toBe(true)
      // Fixed token should still be valid
      const validation = validateProToken('WILDER PRO')
      expect(validation.valid).toBe(true)
    })
  })

  describe('getTokenStats', () => {
    beforeAll(() => {
      clearAllOneTimeTokens()
      generateTokenBatch('invite', 10)
      generateTokenBatch('pro', 5)
    })

    it('returns correct stats', () => {
      const stats = getTokenStats()
      expect(stats.invite.total).toBe(10)
      expect(stats.invite.available).toBe(10)
      expect(stats.invite.used).toBe(0)
      expect(stats.pro.total).toBe(5)
      expect(stats.pro.available).toBe(5)
      expect(stats.pro.used).toBe(0)
    })

    it('updates stats after token usage', () => {
      const tokens = JSON.parse(localStorage.getItem(STORAGE_KEYS.ONE_TIME_TOKENS) || '[]')
      const validInvite = tokens.find((t: any) => t.type === 'invite' && t.isValid)
      if (validInvite) {
        useInviteCode(validInvite.token, 'test')
        const stats = getTokenStats()
        expect(stats.invite.used).toBe(1)
        expect(stats.invite.available).toBe(9)
      }
    })
  })
})
