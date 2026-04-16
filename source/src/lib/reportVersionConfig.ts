/**
 * 报告版本配置
 * 统一版本 - GROWMATE科创教育入学测评报告
 * 所有核心功能对所有用户开放
 */

export interface ReportSection {
  id: string
  label: string
  highlight?: boolean
  description?: string
}

export interface ReportVersionConfig {
  name: string
  targetAudience: string
  description: string
  sections: ReportSection[]
  features: {
    showEvidenceChain: boolean
    showMultiModel: boolean
    showAcademicResearch: boolean
    showCareerPlanning: boolean
    showUniversityRecommendation: boolean
    showDetailedAnalysis: boolean
    showParentGuide: boolean
    showActionPlan: boolean
  }
}

// 统一版本配置：整合所有核心功能
export const UNIFIED_VERSION: ReportVersionConfig = {
  name: 'GROWMATE科创教育入学测评报告',
  targetAudience: '家长及教育专业人士',
  description: '全面专业的潜能评估报告，涵盖核心发现、证据链分析、发展路径规划及个性化建议',
  sections: [
    { id: 'section-overview', label: '📊 测评结果总览', highlight: true },
    { id: 'section-ch1', label: '🎯 科创天赋发现' },
    { id: 'section-this-week', label: '📋 本周行动建议' },
    { id: 'section-charts', label: '📈 能力图谱' },
    { id: 'section-evidence', label: '🔬 证据链分析' },
    { id: 'section-4', label: '💎 优势与成长空间' },
    { id: 'section-growth-plan', label: '🗺️ 成长路径规划' },
    { id: 'section-course-match', label: '🎓 课程推荐' },
    { id: 'section-8', label: '💬 家庭沟通指南' },
    { id: 'section-multimodel', label: '🌟 综合潜能画像' },
    { id: 'section-confidence', label: '📊 置信度说明' },
    { id: 'section-expert', label: '👨‍🏫 专家咨询' },
  ],
  features: {
    showEvidenceChain: true,
    showMultiModel: true,
    showAcademicResearch: true,
    showCareerPlanning: true,
    showUniversityRecommendation: true,
    showDetailedAnalysis: true,
    showParentGuide: true,
    showActionPlan: true,
  },
}

// 保持向后兼容的导出
export const STANDARD_VERSION = UNIFIED_VERSION
export const PROFESSIONAL_VERSION = UNIFIED_VERSION

// 统一使用统一版本配置
export function getVersionConfig(_mode?: 'standard' | 'professional'): ReportVersionConfig {
  return UNIFIED_VERSION
}
