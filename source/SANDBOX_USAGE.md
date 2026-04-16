# 动态沙盘推演系统 - 使用指南

## 快速开始

### 1. 在现有评估流程中使用

```tsx
import { SandboxAssessment } from './components/SandboxAssessment'
import { questions } from './lib/ageAdaptiveQuestions'

function App() {
  const handleSandboxComplete = (results) => {
    console.log('维度分数:', results.dimensionScores)
    console.log('决策历史:', results.decisionHistory)
    console.log('用时:', results.elapsedTime, '秒')

    // 可以将结果传递给现有的报告生成系统
    generateReport(results.dimensionScores)
  }

  return (
    <SandboxAssessment
      studentName="小明"
      studentAge={10}
      questions={questions}
      onComplete={handleSandboxComplete}
    />
  )
}
```

### 2. 独立使用沙盘引擎

```tsx
import {
  StoryGenerator,
  createAICharacterForAge,
  getWelcomeMessage,
  getSandboxConfig,
} from './lib/sandbox'

// 创建故事生成器
const storyGenerator = new StoryGenerator()

// 获取年龄适配配置
const config = getSandboxConfig(10)

// 创建AI角色
const character = createAICharacterForAge(10)

// 获取欢迎语
const welcome = getWelcomeMessage('小明', 10)

// 将题目转换为场景
const scene = storyGenerator.mapQuestionToContext(
  question,
  'upper-primary',
  'natural_exploration'
)
```

## 核心概念

### 场景节点 (SceneNode)

每个场景包含：
- `narrative`: 剧情描述
- `decision`: 决策点（包含情境化选项）
- `character`: 出场的AI角色
- `dimensionImpact`: 预估的WILDER维度影响

### 决策流程

```
用户看到场景 → 阅读AI角色对话 → 做出选择 → 更新维度分数 → 进入下一场景
```

### 年龄段适配

| 年龄 | 角色类型 | 场景数 | 时间/场景 | 插画风格 |
|------|---------|-------|----------|---------|
| 3-6岁 | 机器人朋友 | 22 | 120秒 | 卡通友好 |
| 7-9岁 | 魔法精灵 | 25 | 100秒 | 卡通友好 |
| 10-12岁 | 导师 | 28 | 90秒 | 奇幻 |
| 13-15岁 | 投资人 | 30 | 80秒 | 写实编辑 |
| 16-18岁 | 挑战者 | 32 | 75秒 | 写实编辑 |

## 集成到现有系统

### 在App.tsx中替换现有评估

```tsx
// 之前
<MultiModalAssessment
  studentInfo={studentInfo}
  onComplete={handleAssessmentComplete}
/>

// 之后（可选）
<SandboxAssessment
  studentName={studentInfo.name}
  studentAge={studentInfo.age}
  questions={filteredQuestions}
  onComplete={handleSandboxComplete}
/>
```

### 结果映射到现有评分系统

沙盘系统的输出可以直接映射到现有的`AssessmentScores`：

```typescript
function mapSandboxToAssessment(sandboxResults: SandboxResults) {
  return {
    wilder: {
      W: sandboxResults.dimensionScores['W'] || 0,
      I: sandboxResults.dimensionScores['I'] || 0,
      L: sandboxResults.dimensionScores['L'] || 0,
      D: sandboxResults.dimensionScores['D'] || 0,
      E: sandboxResults.dimensionScores['E'] || 0,
      R: sandboxResults.dimensionScores['R'] || 0,
    },
    // ... 其他维度
  }
}
```

## 扩展开发

### 添加新的故事主题

在 `scenarioBank.ts` 中添加：

```typescript
export const STORY_THEME_PACKS = {
  // ... 现有主题
  my_custom_theme: {
    title: '我的主题',
    description: '描述',
    suitableAgeGroups: ['upper-primary'],
    openingScenarios: ['开场情境...'],
  }
}
```

### 自定义AI角色

```typescript
const customCharacter: AICharacter = {
  characterId: 'custom_1',
  name: '自定义角色',
  archetype: 'mentor',
  personality: {
    tone: 'friendly',
    interactionStyle: 'supportive',
    ageAppropriate: ['upper-primary'],
  },
  dialogueStyle: {
    greetingPattern: ['你好！'],
    reactionPattern: {
      positive: ['很好！'],
      negative: ['再想想'],
      neutral: ['继续'],
    },
    transitionPhrases: ['接下来...'],
    closingStyle: '再见！',
  },
  visualPrompt: 'custom illustration prompt',
}
```

### 添加NLP分析

在 `nlpAnalyzer.ts`（Phase 2实现）中：

```typescript
import { ResponseAnalysis } from './types'

function analyzeResponse(text: string): ResponseAnalysis {
  // 分析动词、名词、条件句
  // 推断维度倾向
  return {
    detectedVerbs: [...],
    detectedNouns: [...],
    conditionalPhrases: [...],
    inferredDimensions: {...},
  }
}
```

## 文件结构

```
src/
├── lib/
│   └── sandbox/
│       ├── types.ts              # 类型定义
│       ├── scenarioBank.ts       # 情境素材库
│       ├── storyEngine.ts        # 剧情生成引擎
│       ├── ageAdapter.ts         # 年龄适配器
│       ├── sessionManager.ts     # 会话管理器
│       └── index.ts              # 统一导出
└── components/
    ├── SandboxAssessment.tsx     # 主容器
    └── sandbox/
        ├── StoryPanel.tsx        # 剧情面板
        ├── DecisionPanel.tsx     # 决策面板
        └── CharacterPanel.tsx    # 角色面板
```

## 下一步

Phase 1已完成（剧本引擎MVP），接下来可以：

- **Phase 2**: 实现AI Agent角色互动（NLP分析、对话生成）
- **Phase 3**: 实现多重宇宙测试法（动态分支探测）

详细计划见项目根目录的 `gamified-assessment-system-design.md`
