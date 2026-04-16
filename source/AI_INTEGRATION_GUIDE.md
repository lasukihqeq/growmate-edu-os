# GROWMATE AI-Native 引擎集成指南

> 本文档说明如何将 AI 增强功能集成到现有的报告生成流程中。

---

## 📋 目录

1. [架构概览](#架构概览)
2. [已完成的工作](#已完成的工作)
3. [集成步骤](#集成步骤)
4. [API 配置](#api-配置)
5. [测试验证](#测试验证)
6. [故障排除](#故障排除)

---

## 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                    GROWMATE AI-Native 架构                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  报告生成层   │    │  AI 增强层    │    │  UI 展示层    │  │
│  │              │    │              │    │              │  │
│  │ assessment   │───▶│ aiReport     │───▶│ AIInsight    │  │
│  │ Engine       │    │ Enhancer     │    │ Sections     │  │
│  │              │    │              │    │              │  │
│  │ reportContent│    │ vectorSpace  │    │ - CoT因果链  │  │
│  │ Generator    │    │ Engine       │    │ - 双视角评估  │  │
│  └──────────────┘    │ RAG Engine   │    │ - 涌现人才   │  │
│                      │ CoT Engine   │    └──────────────┘  │
│                      │ Multi-Agent  │                      │
│                      └──────────────┘                      │
│                                                             │
│  数据流：                                                    │
│  1. generateEnhancedReport() 生成基础报告                    │
│  2. computeSyncAIEnhancements() 立即计算向量空间              │
│  3. initAIEnhancement() 后台异步加载 CoT + 双 Agent         │
│  4. AIInsightSections 组件渐进式展示 AI 内容                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 已完成的工作

### ✅ 已创建的文件

| 文件 | 路径 | 状态 |
|------|------|------|
| AI 类型定义 | `src/lib/ai/types.ts` | ✅ 完成 |
| 温度控制器 | `src/lib/ai/temperatureController.ts` | ✅ 完成 |
| AI 服务提供者 | `src/lib/ai/aiServiceProvider.ts` | ✅ 完成 |
| 向量空间引擎 | `src/lib/ai/vectorSpaceEngine.ts` | ✅ 完成 |
| RAG 知识检索 | `src/lib/ai/ragKnowledgeEngine.ts` | ✅ 完成 |
| 提示词模板 | `src/lib/ai/promptTemplates.ts` | ✅ 完成 |
| CoT 推理引擎 | `src/lib/ai/cotReasoningEngine.ts` | ✅ 完成 |
| 双 Agent 评估 | `src/lib/ai/multiAgentEvaluator.ts` | ✅ 完成 |
| 报告 AI 增强层 | `src/lib/aiReportEnhancer.ts` | ✅ 完成 |
| AI 洞察组件 | `src/components/ai/AIInsightSections.tsx` | ✅ 完成 |
| 测试脚本 | `test-deepseek.mjs` | ✅ 完成 |
| 环境变量模板 | `.env.example` | ✅ 更新 |

### ✅ 已修改的文件

| 文件 | 修改内容 |
|------|----------|
| `src/lib/assessmentEngine.ts` | 添加 `vectorPoint` 和 `emergentTalents` 字段到 EnhancedReport |
| `.env.example` | 添加 `VITE_DEEPSEEK_API_KEY` 配置 |

---

## 集成步骤

### 步骤 1：配置 API Key

1. 复制 `.env.example` 为 `.env.local`：
   ```bash
   cp .env.example .env.local
   ```

2. 编辑 `.env.local`，填入你的 DeepSeek API Key：
   ```env
   VITE_DEEPSEEK_API_KEY=sk-your-actual-api-key-here
   ```

3. 重启开发服务器：
   ```bash
   npm run dev
   ```

### 步骤 2：测试 API 连通性

运行测试脚本验证 API 是否正常：

```bash
node test-deepseek.mjs
```

预期输出：
```
🔍 测试 DeepSeek API 连通性...
1️⃣ 基础连通性测试 (模型列表)...
✅ 连接成功! 可用模型数: X
2️⃣ 对话完成测试 (deepseek-chat)...
✅ 响应成功! 耗时: XXXms
3️⃣ JSON 输出测试 (CoT推理格式)...
✅ JSON 解析成功! 耗时: XXXms

🎉 所有测试通过! DeepSeek API 已就绪
```

### 步骤 3：在 ReportPage 中集成 AI 组件

> **注意**：ReportPage.tsx 文件非常大（318KB），建议谨慎修改。以下步骤提供精确的代码位置和修改内容。

#### 3.1 添加 Import 语句

在 `ReportPage.tsx` 第 41 行后添加：

```typescript
import { EvidenceChain } from './EvidenceChain'
// 👇 添加以下行
import { CoTCausalChainSection, DualAgentSection, EmergentTalentsSection } from './ai/AIInsightSections'
import { useAIInsights } from './ai/AIInsightSections'
import { computeSyncAIEnhancements } from '../lib/aiReportEnhancer'
```

#### 3.2 在 ReportPage 组件中初始化 AI 数据

在 `ReportPage` 函数内部（约第 724 行 `const d = reportData || DEMO_DATA` 之后）添加：

```typescript
export function ReportPage({ onBack, reportData, isAdminMode: _isAdminMode }: { onBack: () => void; reportData?: DynamicReportData; isAdminMode?: boolean }) {
  const d = reportData || DEMO_DATA

  // 👇 添加 AI 增强数据初始化
  const aiSyncData = reportData ? computeSyncAIEnhancements(
    // 需要从 reportData 重构 scores（或从 App.tsx 传递）
    { wilder: d.wilderScores, profileCode: d.profileCode } as any,
    {} as any // enhancedReport（需要从上游传递）
  ) : null

  const aiInsights = useAIInsights({
    studentName: d.student.name,
    scores: { wilder: d.wilderScores, profileCode: d.profileCode },
    enhancedReport: { profile729: { code: d.profileCode } },
    evidenceChain: d.evidenceChain ? { dimensionEvidences: d.evidenceChain } : undefined,
  })
  // 👆 AI 数据初始化结束
```

#### 3.3 在报告中添加 AI 洞察章节

在 `ReportPage.tsx` 约第 4707 行（证据链章节后）添加：

```tsx
{/* ========== 证据链与高光重现 ========== */}
<section id="section-evidence-chain" ref={trackSection} className="page-break">
  <EvidenceChain reportData={d} />
</section>

{/* 👇 添加 AI 洞察章节 */}
{/* ========== AI 思维链推理 ========== */}
<section id="section-ai-cot" ref={trackSection} className="page-break">
  <CoTCausalChainSection
    causalChains={aiInsights.causalChains}
    loading={aiInsights.loading.cot}
    error={aiInsights.errors.cot}
    studentName={d.student.name}
  />
</section>

{/* ========== AI 双视角对冲评估 ========== */}
<section id="section-ai-dual-agent" ref={trackSection} className="page-break">
  <DualAgentSection
    dualPerspective={aiInsights.dualPerspective}
    loading={aiInsights.loading.dualAgent}
    error={aiInsights.errors.dualAgent}
    studentName={d.student.name}
  />
</section>

{/* ========== AI 涌现人才探测 ========== */}
<section id="section-ai-emergent" ref={trackSection} className="page-break">
  <EmergentTalentsSection
    emergentTalents={aiSyncData?.emergentTalents || null}
    vectorPoint={aiSyncData?.vectorPoint || null}
    studentName={d.student.name}
  />
</section>
{/* 👆 AI 洞察章节结束 */}

{/* ========== 专家解读 ========== */}
<section id="section-expert" ref={trackSection} className="page-break">
```

### 步骤 4：优化数据传递（推荐）

为了获得完整的 AI 功能，建议从 `App.tsx` 传递 `assessmentScores` 和 `enhancedReport` 到 `ReportPage`：

#### 4.1 修改 App.tsx 的 ReportPage 调用

在 `App.tsx` 约第 235 行：

```tsx
{/* 修改前 */}
<ReportPage onBack={handleBackToHome} reportData={dynamicReport ?? undefined} />

{/* 修改后 */}
<ReportPage
  onBack={handleBackToHome}
  reportData={dynamicReport ?? undefined}
  assessmentScores={assessmentScores ?? undefined}
  enhancedReport={enhancedReport ?? undefined}
  evidenceChain={evidenceChain ?? undefined}
/>
```

#### 4.2 更新 ReportPage 接口

在 `ReportPage.tsx` 第 723 行更新函数签名：

```typescript
// 修改前
export function ReportPage({ onBack, reportData, isAdminMode: _isAdminMode }: { onBack: () => void; reportData?: DynamicReportData; isAdminMode?: boolean }) {

// 修改后
import type { AssessmentScores, EnhancedReport } from '../lib/assessmentEngine'
import type { EvidenceChain } from '../lib/evidenceChainBuilder'

export function ReportPage({
  onBack,
  reportData,
  isAdminMode: _isAdminMode,
  assessmentScores,
  enhancedReport,
  evidenceChain,
}: {
  onBack: () => void
  reportData?: DynamicReportData
  isAdminMode?: boolean
  assessmentScores?: AssessmentScores
  enhancedReport?: EnhancedReport
  evidenceChain?: EvidenceChain
}) {
```

#### 4.3 使用完整数据初始化 AI

```typescript
const d = reportData || DEMO_DATA

// 使用完整数据初始化 AI 增强
const aiInit = (assessmentScores && enhancedReport)
  ? initAIEnhancement(
      { name: d.student.name, age: d.student.age, grade: '', school: '', testDate: '' },
      assessmentScores,
      enhancedReport,
      evidenceChain ? { dimensionEvidences: evidenceChain.dimensionEvidences } : undefined
    )
  : null

const [aiAsyncData, setAiAsyncData] = useState<{
  causalChains: CausalChain[] | null
  dualPerspective: DualPerspectiveReport | null
  cotError: string | null
  dualError: string | null
}>({ causalChains: null, dualPerspective: null, cotError: null, dualError: null })

useEffect(() => {
  if (!aiInit?.asyncPromise) return
  let cancelled = false
  aiInit.asyncPromise.then(data => {
    if (!cancelled) setAiAsyncData(data)
  })
  return () => { cancelled = true }
}, [aiInit])
```

---

## API 配置

### DeepSeek API

- **获取地址**：https://platform.deepseek.com/
- **模型名称**：`deepseek-chat`
- **API 格式**：兼容 OpenAI Chat Completions API
- **推荐配置**：
  ```env
  VITE_DEEPSEEK_API_KEY=sk-xxx
  ```

### 降级链配置

AI 服务支持自动降级：

```
DeepSeek (主) → OpenAI (备) → MiniMax (备) → 同步模板 (最终降级)
```

如果所有 API 都不可用，系统会自动使用同步降级方案，确保报告正常生成。

---

## 测试验证

### 1. 开发环境测试

```bash
# 启动开发服务器
npm run dev

# 完成测评流程后检查：
# 1. 报告中是否显示 AI 洞察章节
# 2. 加载状态是否正常
# 3. 错误降级是否生效
```

### 2. API 连通性测试

```bash
node test-deepseek.mjs
```

### 3. TypeScript 编译检查

```bash
npx tsc --noEmit
```

---

## 故障排除

### 问题 1：AI 组件不显示

**原因**：API Key 未配置或无效

**解决方案**：
1. 检查 `.env.local` 是否存在且包含 `VITE_DEEPSEEK_API_KEY`
2. 运行 `node test-deepseek.mjs` 验证 API 连通性
3. 检查浏览器控制台是否有 `[AIService]` 相关警告

### 问题 2：加载状态卡住

**原因**：LLM 调用超时

**解决方案**：
1. 检查网络连接
2. 确认 DeepSeek 账户余额充足
3. AI 增强层有 30 秒超时保护，超时后会自动降级

### 问题 3：TypeScript 编译错误

**常见错误**：
- `Cannot find module './ai/types'` → 确认文件路径正确
- `Property 'vectorPoint' does not exist` → 确认 assessmentEngine.ts 已更新

**解决方案**：
```bash
# 清理缓存并重新编译
rm -rf node_modules/.vite
npm run dev
```

### 问题 4：报告样式异常

**原因**：AI 组件使用了未定义的 Tailwind 类

**解决方案**：
1. 确认 `tailwind.config.js` 包含所有使用的颜色类
2. 检查浏览器是否正确加载了 CSS

---

## 性能优化建议

### 1. 异步加载策略

AI 增强功能采用**非阻塞异步**模式：
- 向量空间和涌现人才：同步计算（< 1ms）
- CoT 推理和双 Agent：异步加载（1-5 秒）
- 报告先展示基础内容，AI 内容加载完成后渐进式显示

### 2. 缓存策略

```typescript
// 建议使用 SessionStorage 缓存 AI 结果
sessionStorage.setItem(`ai-enhanced-${profileCode}`, JSON.stringify(aiResult))
```

### 3. 按需加载

如果只需要部分 AI 功能，可以单独调用：

```typescript
// 只计算向量空间（同步）
const { vectorPoint, emergentTalents } = computeSyncAIEnhancements(scores, report)

// 只调用 CoT 推理（异步）
const cotResult = await performAsyncCoTReasoning(student, scores, report)

// 只调用双 Agent 评估（异步）
const dualResult = await performAsyncDualAgentEvaluation(student, scores, report)
```

---

## 下一步

- [ ] 集成到 ReportPage.tsx（按上述步骤手动修改）
- [ ] 配置 DeepSeek API Key 并测试
- [ ] 根据实际需求调整 AI 组件样式
- [ ] 添加 AI 内容的打印优化
- [ ] 考虑添加 AI 结果缓存

---

## 技术支持

如有问题，请检查：
1. 浏览器控制台的 `[AIEnhancer]` 和 `[AIService]` 日志
2. TypeScript 编译错误：`npx tsc --noEmit`
3. API 连通性：`node test-deepseek.mjs`
