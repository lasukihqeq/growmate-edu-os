/**
 * GROWMATE科创教育入学测评 API 客户端
 * 服务端模式：数据存储在腾讯云 PostgreSQL，localStorage 仅作为备份
 */

const API_BASE = import.meta.env.DEV
  ? 'http://assessment.hykx.com.cn/api'
  : '/api'

// 管理员令牌 - 从环境变量读取（无默认值，需在 .env.local 中配置）
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || ''

// ==================== Token 管理 ====================

let adminToken = ''

export function setAdminToken(token: string) {
  adminToken = token
  localStorage.setItem('growmate_admin_token', token)
}

export function getAdminToken(): string {
  if (!adminToken) {
    adminToken = localStorage.getItem('growmate_admin_token') || ''
  }
  return adminToken
}

function adminHeaders(): Record<string, string> {
  const token = getAdminToken()
  if (!token) {
    console.warn('[API] 管理员令牌未设置，请在管理后台设置令牌')
  }
  return {
    'Content-Type': 'application/json',
    'X-Admin-Token': token,
  }
}

// 验证管理员令牌是否已设置
export function isAdminTokenSet(): boolean {
  return !!getAdminToken()
}

// ==================== localStorage 备份（迁移用）====================

const STORAGE_KEY = 'wilder_assessments'

function getLocalAssessments(): Array<Record<string, unknown>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalBackup(data: Record<string, unknown>) {
  try {
    const list = getLocalAssessments()
    const entry = {
      id: Date.now().toString(),
      studentInfo: data.studentInfo,
      talentType: data.talentType,
      profileCode: data.profileCode,
      reportData: data.dynamicReport, // 完整报告数据，用于后续查看
      createdAt: new Date().toISOString(),
      synced: true, // 标记为已同步
    }
    list.unshift(entry)
    // 只保留最近 100 条作为备份
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 100)))
  } catch (e) {
    console.warn('[API] localStorage 备份失败:', e)
  }
}

// ==================== 公开接口 ====================

/** 保存测评结果（服务端优先，含重试 + 离线缓存） */
export async function saveAssessment(data: {
  studentInfo: Record<string, unknown>
  assessmentScores: Record<string, unknown>
  dynamicReport: Record<string, unknown>
  talentType?: string
  profileCode?: string
  durationSeconds?: number
}): Promise<{ success: boolean; id?: string; error?: string }> {
  // 转换字段名：前端 assessmentScores → 后端 scores
  const payload = {
    studentInfo: data.studentInfo,
    scores: data.assessmentScores,
    dynamicReport: data.dynamicReport,
    talentType: data.talentType,
    profileCode: data.profileCode,
    durationSeconds: data.durationSeconds,
    // 附加技术信息
    meta: {
      userAgent: navigator.userAgent,
      screenSize: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timestamp: new Date().toISOString(),
    },
  }

  // 带重试的提交（最多 3 次）
  let lastError: Error | null = null
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`${API_BASE}/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const result = await res.json()
      console.log(`[API] 测评结果已保存到服务器 (第${attempt}次), ID:`, result.id)

      // 本地备份（标记已同步）
      saveLocalBackup({ ...data, serverId: result.id })

      return { success: true, id: result.id }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      console.warn(`[API] 第${attempt}次保存失败:`, lastError.message)
      if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt)) // 递增退避
    }
  }

  // 3 次均失败 → 本地持久化（标记未同步）
  console.error('[API] 服务器保存彻底失败，本地缓存:', lastError)
  const localList = getLocalAssessments()
  const localEntry = {
    id: Date.now().toString(),
    studentInfo: data.studentInfo,
    talentType: data.talentType,
    profileCode: data.profileCode,
    reportData: data.dynamicReport, // 完整报告数据
    payload, // 保留完整 payload 便于后续重传
    createdAt: new Date().toISOString(),
    synced: false,
  }
  localList.unshift(localEntry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(localList))

  return { success: true, id: String(localEntry.id), error: '已保存到本地，待网络恢复后同步' }
}

/** 自动同步未上传的本地缓存（页面加载时调用） */
export async function autoSyncPending(): Promise<void> {
  const pending = getPendingMigration()
  if (pending.length === 0) return
  console.log(`[API] 发现 ${pending.length} 条未同步数据，开始自动同步...`)
  const { migrated, failed } = await migrateLocalData()
  console.log(`[API] 自动同步完成: 成功 ${migrated}, 失败 ${failed}`)
}

// ==================== 管理员验证 ====================

/** 验证管理员令牌 */
export async function verifyAdmin(): Promise<boolean> {
  const token = getAdminToken()
  if (!token) return false

  // 环境变量配置的单一令牌（无硬编码白名单）
  if (ADMIN_TOKEN && token === ADMIN_TOKEN) return true

  // 尝试服务端验证
  try {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      headers: { 'X-Admin-Token': token }
    })
    if (res.ok) return true
  } catch {
    // 网络错误，忽略
  }

  return false
}

// ==================== 统计数据 ====================

/** 获取统计数据 */
export async function getStats() {
  try {
    const res = await fetch(`${API_BASE}/admin/stats`, { headers: adminHeaders() })
    if (!res.ok) throw new Error('未授权')
    return res.json()
  } catch (err) {
    console.warn('[API] 获取远程统计失败，使用本地数据:', err)
    return computeLocalStats()
  }
}

/** 获取销售漏斗统计 */
export async function getSalesStats() {
  const res = await fetch(`${API_BASE}/admin/stats/sales`, { headers: adminHeaders() })
  if (!res.ok) throw new Error('获取销售统计失败')
  return res.json()
}

/** 获取待跟进列表 */
export async function getPendingFollowups() {
  const res = await fetch(`${API_BASE}/admin/stats/pending-followups`, { headers: adminHeaders() })
  if (!res.ok) throw new Error('获取待跟进列表失败')
  return res.json()
}

// ==================== 测评管理 ====================

/** 获取测评列表 */
export async function getAssessments(params: {
  page?: number
  per_page?: number
  search?: string
  talent_type?: string
  sort_by?: string
  sort_order?: string
  start_date?: string
  end_date?: string
}) {
  try {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') query.set(k, String(v))
    })
    const res = await fetch(`${API_BASE}/assessments?${query}`, { headers: adminHeaders() })
    if (!res.ok) throw new Error('未授权')
    return res.json()
  } catch (err) {
    console.warn('[API] 获取远程列表失败，使用本地数据:', err)
    return computeLocalAssessments(params)
  }
}

/** 获取单条测评详情 */
export async function getAssessmentDetail(id: string | number) {
  try {
    const res = await fetch(`${API_BASE}/assessments/${id}`, { headers: adminHeaders() })
    if (!res.ok) throw new Error('未授权')
    const remoteData = await res.json()
    
    // 如果远程数据缺少 full_report，尝试从本地补充
    if (!remoteData.full_report) {
      try {
        const localData = findLocalAssessment(id)
        if (localData?.full_report) {
          remoteData.full_report = localData.full_report
        }
      } catch { /* 本地无数据，忽略 */ }
    }
    return remoteData
  } catch (err) {
    console.warn('[API] 获取远程详情失败，尝试本地查找:', err)
    return findLocalAssessment(id)
  }
}

/** 删除测评记录 */
export async function deleteAssessment(id: string | number) {
  const res = await fetch(`${API_BASE}/assessments/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  })
  if (!res.ok) throw new Error('删除失败')
  
  // 同步删除本地备份
  const list = getLocalAssessments()
  const filtered = list.filter(a => String(a.id) !== String(id) && a.serverId !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  
  return res.json()
}

// ==================== 学生管理 ====================

/** 获取学生列表 */
export async function getStudents(params: {
  page?: number
  per_page?: number
  search?: string
  crm_stage?: string
}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.set(k, String(v))
  })
  const res = await fetch(`${API_BASE}/students?${query}`, { headers: adminHeaders() })
  if (!res.ok) throw new Error('获取学生列表失败')
  return res.json()
}

/** 获取学生详情（含成长档案）*/
export async function getStudentDetail(id: string) {
  const res = await fetch(`${API_BASE}/students/${id}`, { headers: adminHeaders() })
  if (!res.ok) throw new Error('获取学生详情失败')
  return res.json()
}

/** 更新学生信息 */
export async function updateStudent(id: string, data: {
  student_name?: string
  crm_stage?: string
  tags?: string[]
  assigned_sales?: string
  notes?: string
}) {
  const res = await fetch(`${API_BASE}/students/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('更新学生信息失败')
  return res.json()
}

/** 获取学生成长时间线 */
export async function getStudentGrowthTimeline(id: string) {
  const res = await fetch(`${API_BASE}/students/${id}/growth-timeline`, { headers: adminHeaders() })
  if (!res.ok) throw new Error('获取成长时间线失败')
  return res.json()
}

/** 添加课程干预记录 */
export async function addIntervention(studentId: string, data: {
  course_name: string
  course_type: string
  start_date: string
  end_date?: string
  progress?: number
  notes?: string
}) {
  const res = await fetch(`${API_BASE}/students/${studentId}/interventions`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('添加课程记录失败')
  return res.json()
}

/** 添加跟进记录 */
export async function addFollowup(studentId: string, data: {
  follow_type: string
  content: string
  next_follow_date?: string
  sales_name?: string
}) {
  const res = await fetch(`${API_BASE}/students/${studentId}/follow-ups`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('添加跟进记录失败')
  return res.json()
}

// ==================== 导出功能 ====================

/** 导出数据 URL */
export function getExportUrl(format: 'csv' | 'json' = 'csv'): string {
  return `${API_BASE}/admin/export?format=${format}&token=${getAdminToken()}`
}

// ==================== PDF 生成 ====================

/** 请求生成 PDF 报告 */
export async function generatePdf(assessmentId: string): Promise<{ success: boolean; download_url?: string; error?: string }> {
  const res = await fetch(`${API_BASE}/pdf/generate`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({ assessment_id: assessmentId }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'PDF 生成失败' }))
    return { success: false, error: err.error }
  }
  return res.json()
}

/** 查询 PDF 生成状态 */
export async function getPdfStatus(assessmentId: string) {
  const res = await fetch(`${API_BASE}/pdf/status/${assessmentId}`, { headers: adminHeaders() })
  if (!res.ok) throw new Error('查询 PDF 状态失败')
  return res.json()
}

// ==================== 数据迁移 ====================

/** 获取待迁移的本地数据 */
export function getPendingMigration(): Array<Record<string, unknown>> {
  return getLocalAssessments().filter(a => !a.synced)
}

/** 迁移本地数据到服务器 */
export async function migrateLocalData(): Promise<{ migrated: number; failed: number }> {
  const pending = getPendingMigration()
  let migrated = 0
  let failed = 0
  
  for (const item of pending) {
    try {
      const res = await fetch(`${API_BASE}/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentInfo: item.studentInfo,
          assessmentScores: item.assessmentScores,
          dynamicReport: item.dynamicReport,
          talentType: item.talentType,
          profileCode: item.profileCode,
          durationSeconds: item.durationSeconds,
        }),
      })
      
      if (res.ok) {
        // 标记为已同步
        const list = getLocalAssessments()
        const idx = list.findIndex(a => a.id === item.id)
        if (idx >= 0) {
          list[idx].synced = true
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
        }
        migrated++
      } else {
        failed++
      }
    } catch {
      failed++
    }
  }
  
  return { migrated, failed }
}

/** 获取迁移状态 */
export function getMigrationStatus() {
  const all = getLocalAssessments()
  const pending = all.filter(a => !a.synced)
  return {
    total: all.length,
    synced: all.length - pending.length,
    pending: pending.length,
  }
}

// ==================== 本地计算（降级模式）====================

function computeLocalStats() {
  const list = getLocalAssessments()
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString()
  const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString()

  const todayCount = list.filter(a => typeof a.createdAt === 'string' && (a.createdAt as string).startsWith(today)).length
  const weekCount = list.filter(a => typeof a.createdAt === 'string' && (a.createdAt as string) >= weekAgo).length
  const monthCount = list.filter(a => typeof a.createdAt === 'string' && (a.createdAt as string) >= monthAgo).length

  const talentCounts: Record<string, number> = {}
  const ageCounts: Record<number, number> = {}
  const wilderSums: Record<string, number> = { W: 0, I: 0, L: 0, D: 0, E: 0, R: 0 }

  list.forEach(a => {
    const t = (a.talentType as string) || '未知'
    talentCounts[t] = (talentCounts[t] || 0) + 1
    const info = a.studentInfo as Record<string, unknown> | undefined
    const age = (info?.age as number) || 0
    if (age > 0) ageCounts[age] = (ageCounts[age] || 0) + 1
    const scores = a.assessmentScores as Record<string, unknown> | undefined
    const ws = (scores?.wilder || scores) as Record<string, number> | undefined
    if (ws) {
      for (const k of ['W', 'I', 'L', 'D', 'E', 'R']) {
        wilderSums[k] += (ws[k] as number) || 0
      }
    }
  })

  const n = list.length || 1
  const avg_scores: Record<string, number> = {}
  for (const k of ['W', 'I', 'L', 'D', 'E', 'R']) {
    avg_scores[k] = Math.round(wilderSums[k] / n)
  }

  return {
    total: list.length,
    today: todayCount,
    this_week: weekCount,
    this_month: monthCount,
    avg_scores,
    talent_distribution: Object.entries(talentCounts)
      .map(([talent_type, count]) => ({ talent_type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    age_distribution: Object.entries(ageCounts)
      .map(([age, count]) => ({ student_age: Number(age), count }))
      .sort((a, b) => a.student_age - b.student_age),
    daily_counts: [],
  }
}

function computeLocalAssessments(params: { page?: number; per_page?: number; search?: string }) {
  let list = getLocalAssessments()
  
  if (params.search) {
    const kw = params.search.toLowerCase()
    list = list.filter(a => {
      const info = a.studentInfo as Record<string, unknown> | undefined
      const name = ((info?.name as string) || '').toLowerCase()
      const phone = ((info?.phone as string) || '')
      return name.includes(kw) || phone.includes(kw)
    })
  }
  
  const total = list.length
  const page = params.page || 1
  const perPage = params.per_page || 20
  const start = (page - 1) * perPage
  const totalPages = Math.ceil(total / perPage)
  
  const data = list.slice(start, start + perPage).map(a => {
    const info = a.studentInfo as Record<string, unknown> | undefined
    const scores = a.assessmentScores as Record<string, unknown> | undefined
    const wilderScores = (scores?.wilder || scores) as Record<string, number> | undefined
    return {
      id: a.serverId || a.id,
      student_name: (info?.name as string) || '未知',
      student_age: (info?.age as number) || 0,
      student_grade: (info?.grade as string) || '',
      parent_phone: (info?.phone as string) || '',
      parent_name: (info?.parentName as string) || '',
      student_school: (info?.school as string) || '',
      interest_classes: (info?.interestClasses as string) || '',
      structured_interests: (info?.structuredInterests as unknown[]) || null,
      talent_type: (a.talentType as string) || '未知',
      profile_code: (a.profileCode as string) || '',
      score_w: (wilderScores?.W as number) || 0,
      score_i: (wilderScores?.I as number) || 0,
      score_l: (wilderScores?.L as number) || 0,
      score_d: (wilderScores?.D as number) || 0,
      score_e: (wilderScores?.E as number) || 0,
      score_r: (wilderScores?.R as number) || 0,
      duration_seconds: (a.durationSeconds as number) || 0,
      created_at: (a.createdAt as string) || new Date().toISOString(),
      status: 'completed',
      synced: a.synced ?? false,
    }
  })
  
  return { data, total, page, per_page: perPage, total_pages: totalPages }
}

function findLocalAssessment(id: string | number) {
  const list = getLocalAssessments()
  const item = list.find(a => String(a.id) === String(id) || a.serverId === id)
  if (!item) throw new Error('记录不存在')
  
  const info = item.studentInfo as Record<string, unknown> | undefined
  const scores = item.assessmentScores as Record<string, unknown> | undefined
  const wilderScores = (scores?.wilder || scores) as Record<string, number> | undefined
  
  return {
    id: item.serverId || item.id,
    student_name: (info?.name as string) || '未知',
    student_age: (info?.age as number) || 0,
    student_grade: (info?.grade as string) || '',
    parent_phone: (info?.phone as string) || '',
    parent_name: (info?.parentName as string) || '',
    student_school: (info?.school as string) || '',
    interest_classes: (info?.interestClasses as string) || '',
    structured_interests: (info?.structuredInterests as unknown[]) || null,
    talent_type: (item.talentType as string) || '未知',
    profile_code: (item.profileCode as string) || '',
    score_w: (wilderScores?.W as number) || 0,
    score_i: (wilderScores?.I as number) || 0,
    score_l: (wilderScores?.L as number) || 0,
    score_d: (wilderScores?.D as number) || 0,
    score_e: (wilderScores?.E as number) || 0,
    score_r: (wilderScores?.R as number) || 0,
    duration_seconds: (item.durationSeconds as number) || 0,
    created_at: (item.createdAt as string) || new Date().toISOString(),
    status: 'completed',
    full_report: item.dynamicReport || null,
  }
}

// ==================== 销售团队管理 ====================

/** 获取销售团队列表 */
export async function getSalesMembers(isActive?: boolean) {
  const query = isActive !== undefined ? `?is_active=${isActive}` : ''
  const res = await fetch(`${API_BASE}/sales-members${query}`, { headers: adminHeaders() })
  if (!res.ok) throw new Error('获取销售团队失败')
  return res.json()
}

/** 创建销售成员 */
export async function createSalesMember(data: {
  name: string
  phone?: string
  role?: string
  monthly_target?: number
}) {
  const res = await fetch(`${API_BASE}/sales-members`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('创建销售成员失败')
  return res.json()
}

/** 更新销售成员 */
export async function updateSalesMember(id: string, data: {
  name?: string
  phone?: string
  role?: string
  monthly_target?: number
  is_active?: boolean
}) {
  const res = await fetch(`${API_BASE}/sales-members/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('更新销售成员失败')
  return res.json()
}

/** 获取销售业绩详情 */
export async function getSalesPerformance(id: string, startDate?: string, endDate?: string) {
  const query = new URLSearchParams()
  if (startDate) query.set('start_date', startDate)
  if (endDate) query.set('end_date', endDate)
  const res = await fetch(`${API_BASE}/sales-members/${id}/performance?${query}`, { headers: adminHeaders() })
  if (!res.ok) throw new Error('获取销售业绩失败')
  return res.json()
}

// ==================== 订单管理 ====================

/** 获取订单列表 */
export async function getOrders(params: {
  page?: number
  limit?: number
  student_id?: string
  sales_member_id?: string
  order_type?: string
  start_date?: string
  end_date?: string
}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.set(k, String(v))
  })
  const res = await fetch(`${API_BASE}/orders?${query}`, { headers: adminHeaders() })
  if (!res.ok) throw new Error('获取订单列表失败')
  return res.json()
}

/** 创建订单 */
export async function createOrder(data: {
  student_id: string
  sales_member_id?: string
  course_name?: string
  amount: number
  paid_amount?: number
  payment_method?: string
  order_type?: string
  notes?: string
}) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('创建订单失败')
  return res.json()
}

/** 更新订单 */
export async function updateOrder(id: string, data: {
  course_name?: string
  amount?: number
  paid_amount?: number
  payment_method?: string
  notes?: string
}) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('更新订单失败')
  return res.json()
}

/** 获取订单营收汇总 */
export async function getOrderSummary() {
  const res = await fetch(`${API_BASE}/orders/summary`, { headers: adminHeaders() })
  if (!res.ok) throw new Error('获取营收汇总失败')
  return res.json()
}

// ==================== 提醒任务管理 ====================

/** 获取今日提醒 */
export async function getTodayReminders(assignedTo?: string) {
  const query = assignedTo ? `?assigned_to=${assignedTo}` : ''
  const res = await fetch(`${API_BASE}/reminders/today${query}`, { headers: adminHeaders() })
  if (!res.ok) throw new Error('获取今日提醒失败')
  return res.json()
}

/** 获取提醒列表 */
export async function getReminders(params: {
  page?: number
  limit?: number
  status?: string
  assigned_to?: string
  student_id?: string
}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.set(k, String(v))
  })
  const res = await fetch(`${API_BASE}/reminders?${query}`, { headers: adminHeaders() })
  if (!res.ok) throw new Error('获取提醒列表失败')
  return res.json()
}

/** 创建提醒 */
export async function createReminder(data: {
  student_id?: string
  assigned_to?: string
  remind_type?: string
  remind_at: string
  title: string
  notes?: string
}) {
  const res = await fetch(`${API_BASE}/reminders`, {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('创建提醒失败')
  return res.json()
}

/** 完成提醒 */
export async function completeReminder(id: string) {
  const res = await fetch(`${API_BASE}/reminders/${id}/done`, {
    method: 'PUT',
    headers: adminHeaders(),
  })
  if (!res.ok) throw new Error('完成提醒失败')
  return res.json()
}

/** 延后提醒 */
export async function snoozeReminder(id: string, snoozeUntil: string) {
  const res = await fetch(`${API_BASE}/reminders/${id}/snooze`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({ snooze_until: snoozeUntil }),
  })
  if (!res.ok) throw new Error('延后提醒失败')
  return res.json()
}

/** 删除提醒 */
export async function deleteReminder(id: string) {
  const res = await fetch(`${API_BASE}/reminders/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  })
  if (!res.ok) throw new Error('删除提醒失败')
  return res.json()
}
