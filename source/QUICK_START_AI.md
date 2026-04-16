# GROWMATE AI 快速集成指南（5 分钟）

> 本指南提供精确的代码修改位置，帮助你在 5 分钟内完成 AI 功能集成。

---

## 🚀 快速开始

### 第 1 步：配置 API Key（1 分钟）

```bash
# 1. 复制环境变量模板
cp .env.example .env.local

# 2. 编辑 .env.local，添加你的 DeepSeek API Key
# VITE_DEEPSEEK_API_KEY=sk-your-api-key-here
```

### 第 2 步：测试 API（30 秒）

```bash
node test-deepseek.mjs
```

### 第 3 步：修改 ReportPage.tsx（3 分钟）

#### 修改 1：添加 Import（第 42 行后）

打开 `src/components/ReportPage.tsx`，在第 42 行后添加：

```typescript
import { EvidenceChain } from './EvidenceChain'
// ===== 添加以下行 =====
import { AIInsightReportSection } from './ai/AIInsightReportSection'
```

#### 修改 2：添加 AI 章节（第 4707 行后）

找到第 4707 行（证据链章节结束标签后），添加：

```tsx
          {/* ========== 证据链与高光重现 ========== */}
          <section id="section-evidence-chain" ref={trackSection} className="page-break">
            <EvidenceChain reportData={d} />
          </section>

          {/* ===== 添加以下 AI 洞察章节 ===== */}
          {/* ========== AI 深度分析 ========== */}
          <AIInsightReportSection
            studentName={d.student.name}
            studentAge={d.student.age}
            wilderScores={d.wilderScores}
            profileCode={d.profileCode}
          />
          {/* ===== AI 洞察章节结束 ===== */}

          {/* ========== 专家解读 ========== */}
          <section id="section-expert" ref={trackSection} className="page-break">
```

#### 修改 3：保存并测试

```bash
# 保存文件后，重启开发服务器
npm run dev

# 完成测评流程，查看报告中是否出现 AI 分析章节
```

---

## ✅ 验证清单

完成集成后，检查以下内容：

- [ ] 报告中出现 "AI 思维链推理" 章节
- [ ] 报告中出现 "双视角对冲评估" 章节  
- [ ] 报告中出现 "涌现人才探测" 章节
- [ ] 加载状态正常显示（骨架屏）
- [ ] 如果没有 API Key，显示降级提示

---

## 🔧 可选：完整集成（推荐用于生产环境）

如果你希望获得完整的 AI 功能（包括 CoT 推理和双 Agent 评估），需要从 App.tsx 传递完整数据：

### App.tsx 修改

```tsx
// 第 235 行，修改 ReportPage 调用
<ReportPage
  onBack={handleBackToHome}
  reportData={dynamicReport ?? undefined}
  assessmentScores={assessmentScores ?? undefined}  // 添加
  enhancedReport={enhancedReport ?? undefined}      // 添加
  evidenceChain={evidenceChain ?? undefined}        // 添加
/>
```

### ReportPage.tsx 修改

```tsx
// 第 723 行，更新函数签名
export function ReportPage({
  onBack,
  reportData,
  isAdminMode: _isAdminMode,
  assessmentScores,    // 添加
  enhancedReport,      // 添加
  evidenceChain,       // 添加
}: {
  onBack: () => void
  reportData?: DynamicReportData
  isAdminMode?: boolean
  assessmentScores?: AssessmentScores    // 添加类型
  enhancedReport?: EnhancedReport        // 添加类型
  evidenceChain?: EvidenceChain          // 添加类型
}) {

// 第 4708 行，更新 AIInsightReportSection 调用
<AIInsightReportSection
  studentName={d.student.name}
  studentAge={d.student.age}
  assessmentScores={assessmentScores}    // 传递完整数据
  enhancedReport={enhancedReport}        // 传递完整数据
  evidenceChain={evidenceChain}          // 传递完整数据
/>
```

---

## 🐛 故障排除

### 问题：AI 章节不显示

**检查点**：
1. 确认 `AIInsightReportSection` import 路径正确
2. 检查浏览器控制台是否有错误
3. 确认 `wilderScores` 和 `profileCode` 有值

### 问题：加载状态卡住

**解决方案**：
- AI 功能有 30 秒超时保护
- 检查浏览器控制台的 `[AIEnhancer]` 日志
- 如果没有 API Key，会自动降级为基础分析

### 问题：TypeScript 编译错误

**解决方案**：
```bash
# 清理 Vite 缓存
rm -rf node_modules/.vite

# 重新编译
npx tsc --noEmit
```

---

## 📊 功能对比

| 功能 | 简化集成 | 完整集成 |
|------|---------|---------|
| 向量空间分析 | ✅ | ✅ |
| 涌现人才探测 | ✅ | ✅ |
| CoT 思维链推理 | ⚠️ 降级版 | ✅ 完整版 |
| 双 Agent 评估 | ⚠️ 降级版 | ✅ 完整版 |
| LLM 增强 | ❌ | ✅ |

**建议**：
- **开发测试**：使用简化集成（3 行代码）
- **生产环境**：使用完整集成（传递完整数据）

---

## 🎯 下一步

集成完成后，你可以：

1. **调整样式**：修改 `src/components/ai/AIInsightSections.tsx` 中的 Tailwind 类
2. **添加打印优化**：在 `@media print` 中添加 AI 章节样式
3. **自定义 AI 提示词**：修改 `src/lib/ai/promptTemplates.ts`
4. **扩展 AI 功能**：参考 `src/lib/ai/` 目录中的模块

---

## 📞 技术支持

遇到问题？检查以下日志：

```javascript
// 浏览器控制台
[AIEnhancer] - AI 增强层日志
[AIService] - LLM API 调用日志
[CoT Engine] - 思维链推理日志
```

运行诊断命令：

```bash
# 检查 API 连通性
node test-deepseek.mjs

# 检查 TypeScript 编译
npx tsc --noEmit

# 查看文件结构
ls -la src/lib/ai/
ls -la src/components/ai/
```
