// 认证服务 - 后续可迁移到腾讯云CloudBase
// 注意：前端认证无法做到完全安全，仅作基础保护
// 密码使用 SHA-256 + 盐 哈希存储，不可逆

// SHA-256 哈希（使用 Web Crypto API）
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'growmate-salt-2026')
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// 兼容旧版 Base64 编码解码（仅用于迁移）
function decodeLegacyPassword(encoded: string): string {
  try {
    return decodeURIComponent(atob(encoded))
  } catch {
    return encoded
  }
}

// 管理员账号 - 从环境变量读取
// 格式: JSON字符串，如 '[{"phone":"18888888888","password":"admin123"}]'
const ADMIN_ACCOUNTS_ENV = import.meta.env.VITE_ADMIN_ACCOUNTS || '[]'

let adminAccounts: Array<{ phone: string; password: string }> = []
try {
  adminAccounts = JSON.parse(ADMIN_ACCOUNTS_ENV)
} catch (e) {
  console.warn('[Auth] 管理员账号配置格式错误，使用空列表')
}

export interface User {
  id: string
  phone: string
  role: 'admin' | 'parent'
  childName?: string
  createdAt: string
}

export interface AuthState {
  isLoggedIn: boolean
  user: User | null
}

// 获取当前用户
export function getCurrentUser(): User | null {
  const userData = localStorage.getItem('wilder_user')
  return userData ? JSON.parse(userData) : null
}

// 检查是否已登录
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

// 检查是否是管理员
export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === 'admin'
}

// 管理员登录
export function adminLogin(phone: string, password: string): { success: boolean; error?: string } {
  const admin = adminAccounts.find(a => a.phone === phone && a.password === password)
  if (admin) {
    const user: User = {
      id: `admin_${phone}`,
      phone,
      role: 'admin',
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem('wilder_user', JSON.stringify(user))
    return { success: true }
  }
  return { success: false, error: '手机号或密码错误' }
}

// 家长注册
export async function parentRegister(phone: string, password: string, childName: string): Promise<{ success: boolean; error?: string }> {
  // 检查是否已注册
  const existingUsers = getStoredParents()
  if (existingUsers.some(u => u.phone === phone)) {
    return { success: false, error: '该手机号已注册' }
  }

  // 存储家长账号（密码使用 SHA-256 哈希）
  const hashedPassword = await hashPassword(password)
  const user: User & { password: string } = {
    id: `parent_${Date.now()}`,
    phone,
    role: 'parent',
    childName,
    createdAt: new Date().toISOString(),
    password: hashedPassword,
  }

  existingUsers.push(user)
  localStorage.setItem('wilder_parents', JSON.stringify(existingUsers))

  // 设置当前登录用户（不包含密码）
  const { password: _, ...userWithoutPassword } = user
  localStorage.setItem('wilder_user', JSON.stringify(userWithoutPassword))

  return { success: true }
}

// 家长登录
export async function parentLogin(phone: string, password: string): Promise<{ success: boolean; error?: string }> {
  const existingUsers = getStoredParents()
  const hashedPassword = await hashPassword(password)
  // 先尝试 SHA-256 哈希比对（新格式）
  let parent = existingUsers.find(u => u.phone === phone && u.password === hashedPassword)

  // 如果哈希比对失败，尝试旧版 Base64 解码比对（兼容迁移）
  if (!parent) {
    parent = existingUsers.find(u => u.phone === phone && decodeLegacyPassword(u.password) === password)
  }

  if (parent) {
    const { password: _, ...userWithoutPassword } = parent
    localStorage.setItem('wilder_user', JSON.stringify(userWithoutPassword))
    return { success: true }
  }

  return { success: false, error: '手机号或密码错误' }
}

// 退出登录
export function logout(): void {
  localStorage.removeItem('wilder_user')
}

// 获取存储的家长账号列表
function getStoredParents(): (User & { password: string })[] {
  const data = localStorage.getItem('wilder_parents')
  return data ? JSON.parse(data) : []
}

// 获取所有家长（管理员用）
export function getAllParents(): User[] {
  return getStoredParents().map(({ password: _, ...user }) => user)
}

// 迁移旧版密码（Base64 → SHA-256）
export async function migratePasswords(): Promise<void> {
  const data = localStorage.getItem('wilder_parents')
  if (!data) return

  try {
    const users = JSON.parse(data) as Array<User & { password: string }>
    let migrated = false

    for (const user of users) {
      if (!user.password) continue
      // SHA-256 哈希固定为 64 字符十六进制，旧版 Base64 通常较短且包含 % 或其他字符
      if (user.password.length !== 64 || !/^[0-9a-f]{64}$/.test(user.password)) {
        // 解码旧密码并重新哈希
        const plainPassword = decodeLegacyPassword(user.password)
        user.password = await hashPassword(plainPassword)
        migrated = true
      }
    }

    if (migrated) {
      localStorage.setItem('wilder_parents', JSON.stringify(users))
      console.log('[Auth] 密码迁移完成（Base64 → SHA-256）')
    }
  } catch (e) {
    console.warn('[Auth] 密码迁移失败', e)
  }
}

// 页面加载时自动执行密码迁移
if (typeof window !== 'undefined') {
  migratePasswords()
}
