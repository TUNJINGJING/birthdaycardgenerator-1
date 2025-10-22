# 生日卡片生成器 - 实现进度文档

## 文档说明
本文档记录项目的实际开发进度、技术架构、组件设计决策和实现细节。每次完成代码开发后需要及时更新此文档。

---

## 项目概览
- **项目名称**：Birthday Card Generator（生日卡片生成器）
- **技术栈**：Next.js 14, TypeScript, Tailwind CSS, NextUI, Replicate AI
- **部署平台**：Vercel
- **数据库**：PostgreSQL (Supabase)
- **存储**：Cloudflare R2

---

## 开发时间线

### 阶段 1: 项目重构 (已完成)
**日期**: 2025-10-22
**任务**: 移除视频生成功能，为生日卡片生成器做准备

#### 完成的工作
1. ✅ 删除 `/src/components/replicate/img-to-video/` 文件夹及所有视频相关组件
2. ✅ 删除 `/src/app/api/predictions/img_to_video/route.ts` API 路由
3. ✅ 更新首页 (`/src/app/[locale]/page.tsx`)：
   - 从 img-to-video 改为 text-to-image 功能
   - Effect ID 从 "1" 改为 "2"
4. ✅ 更新导航栏标题为 "AI Image Generator"
5. ✅ Git commit 并推送到 GitHub main 分支

### 阶段 2: 核心功能实现 (已完成)
**日期**: 2025-10-22
**任务**: 实现生日卡片生成器的核心交互功能

#### 完成的工作

##### 1. 国际化文本更新
**文件**: `/messages/en.json`

更新内容：
- 导航栏文本：Create Card, My Cards
- SEO 标题和描述：聚焦生日卡片生成
- 首页标语：Create Unique Birthday Cards in 3 Minutes
- 样式描述：4 种卡片风格的标题和描述
- 预设祝福语的分类标签
- 输入提示文本

##### 2. 样式选择器组件
**文件**: `/src/components/birthday-card/StyleSelector.tsx`

**组件功能**：
- 提供 4 种生日卡片视觉风格选择：Warm（温馨）、Funny（搞笑）、Formal（正式）、Cute（可爱）
- 每种风格包含：
  - 图标（来自 lucide-react）
  - 渐变背景
  - 标题和描述（多语言支持）

**技术实现**：
```typescript
export type CardStyle = "warm" | "funny" | "formal" | "cute";

const styles: Array<{
  id: CardStyle;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}> = [
  { id: "warm", icon: Heart, gradient: "from-pink-200 via-orange-200 to-yellow-200" },
  { id: "funny", icon: Smile, gradient: "from-red-200 via-yellow-200 via-cyan-200 to-purple-200" },
  { id: "formal", icon: Briefcase, gradient: "from-indigo-300 to-purple-400" },
  { id: "cute", icon: Sparkles, gradient: "from-pink-200 to-purple-200" }
];
```

**交互设计**：
- 选中状态：蓝色边框 + 放大效果 + 右上角勾选图标
- 悬停状态：阴影效果
- 响应式：桌面端 4 列网格，移动端 2 列网格

##### 3. 祝福语预设数据层
**文件**: `/src/components/birthday-card/greetingPresets.ts`

**数据结构**：
```typescript
export type GreetingCategory = "friends" | "family" | "colleagues" | "general";

export interface GreetingPreset {
  id: number;
  category: GreetingCategory;
  content: string;
}
```

**数据内容**：
- Friends（朋友）：10 条祝福语
- Family（家人）：10 条祝福语
- Colleagues（同事）：10 条祝福语
- General（通用）：10 条祝福语
- **总计 40 条精心设计的英文祝福语**

**Helper 函数**：
- `getGreetingsByCategory(category)` - 按类别获取祝福语
- `getAllCategories()` - 获取所有类别

##### 4. 祝福语预设展示组件
**文件**: `/src/components/birthday-card/GreetingPresets.tsx`

**组件功能**：
- 顶部分类标签页（Friends / Family / Colleagues / General）
- 可滚动的祝福语列表（最大高度 64）
- 点击祝福语自动填充到输入框
- 选中状态高亮显示

**交互设计**：
- 分类标签：选中时蓝色背景，未选中时灰色背景
- 祝福语卡片：选中时蓝色边框和背景，未选中时白色带灰色边框
- 悬停效果：边框颜色和阴影变化

##### 5. Worker 组件重构
**文件**: `/src/components/replicate/text-to-image/worker.tsx`

**核心功能改进**：

###### 5.1 AI Prompt 增强系统
```typescript
const stylePrompts = {
  warm: "warm and cozy birthday celebration with soft colors, heartwarming atmosphere, gentle lighting, family-friendly, tender and affectionate mood, ",
  funny: "funny and playful birthday card with cartoon style, bright cheerful colors, humorous elements, joyful and energetic vibe, ",
  formal: "elegant and formal birthday design with sophisticated colors and typography, professional and refined aesthetic, classy celebration, ",
  cute: "cute and adorable birthday theme with pastel colors and charming elements, sweet and lovely atmosphere, kawaii style, "
};

const enhancedPrompt = `${stylePrompts[selectedStyle]}birthday card with text: "${prompt}", creative typography, celebration theme, high quality design`;
```

**设计思路**：
- 将用户的祝福内容（用户意图）与视觉风格指令（AI 提示词）分离
- 用户只需要关注说什么，系统自动处理如何呈现
- 后续优化 prompt 时只需修改 `stylePrompts` 对象

###### 5.2 三步式流程设计
```
Step 1: 选择卡片风格 (StyleSelector)
  ↓
Step 2: 选择或输入祝福语 (GreetingPresets + Textarea)
  ↓
Step 3: 生成卡片 (Button + Output)
```

###### 5.3 UI 布局改进
- 左侧：输入区（样式选择、祝福语选择、自定义输入、生成按钮）
- 右侧：输出区（预览和下载）
- 响应式：移动端上下堆叠

###### 5.4 视觉主题更新
- 容器边框：粉色边框 + 粉色阴影
- 生成按钮：粉色到紫色渐变 + 悬停效果
- 字符计数器：显示 0/200 字符

##### 6. 首页 Hero 组件更新
**文件**: `/src/components/landingpage/top.tsx`

**主要改动**：

###### 6.1 动画图标
```typescript
<Cake className="w-12 h-12 text-pink-500 animate-bounce" style={{animationDelay: '0s'}} />
<Heart className="w-10 h-10 text-red-500 animate-bounce" style={{animationDelay: '0.2s'}} />
<Sparkles className="w-12 h-12 text-yellow-500 animate-bounce" style={{animationDelay: '0.4s'}} />
```
- 3 个图标带有错开的弹跳动画
- 使用 lucide-react 图标库
- 颜色搭配符合生日主题

###### 6.2 渐变标题
```typescript
<h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
```
- 粉色 → 紫色 → 蓝色渐变
- 响应式字体大小（移动端 4xl，桌面端 6xl）

###### 6.3 特性标签
4 个彩色 pill 按钮：
- No Design Skills Needed（粉色）
- AI-Powered（紫色）
- 3-Minute Creation（蓝色）
- Free to Start（绿色）

---

## 技术架构

### 组件架构

#### 核心组件树
```
Worker (父组件)
├── StyleSelector (样式选择)
├── GreetingPresets (祝福语预设)
├── Textarea (自定义输入)
└── Output (结果展示)
```

#### 架构优势
1. **复用性**：StyleSelector 和 GreetingPresets 可以在其他页面使用
2. **可测试性**：每个组件可以独立测试
3. **可维护性**：修改样式选择逻辑时，只需要改 StyleSelector.tsx
4. **状态管理清晰**：父组件 Worker 控制整体流程，子组件只负责展示和用户交互

### 数据层设计

#### 数据与 UI 分离
```
greetingPresets.ts (数据层)
└── 导出 greetingPresets 数组和 helper 函数

GreetingPresets.tsx (展示层)
└── 导入数据并渲染 UI
```

#### 分离的好处
1. **数据管理**：后续可以把祝福语移到数据库，只需要修改数据源
2. **多语言支持**：可以创建 `greetingPresets.zh.ts` 支持中文祝福语
3. **A/B 测试**：可以轻松测试不同的祝福语效果
4. **类型安全**：TypeScript 的类型定义确保数据结构一致

### API 集成

#### 保留的原有逻辑
- API 路由：`/api/predictions/text_to_image`
- 轮询机制：每 1.5 秒检查一次生成状态
- 积分系统：检查 `userSubscriptionInfo.remain_count`
- 结果存储：调用 `/api/effect_result/update` 更新数据库

#### 新增的 Prompt 增强
```typescript
// 用户输入
const userMessage = "Happy Birthday! Hope you have an amazing day!";
const selectedStyle = "warm";

// 系统生成的完整 Prompt
const enhancedPrompt = "warm and cozy birthday celebration with soft colors, heartwarming atmosphere, gentle lighting, family-friendly, tender and affectionate mood, birthday card with text: \"Happy Birthday! Hope you have an amazing day!\", creative typography, celebration theme, high quality design";

// 发送到 Replicate API
fetch("/api/predictions/text_to_image", {
  method: "POST",
  body: JSON.stringify({
    prompt: enhancedPrompt,
    width: 1024,
    height: 1024,
    output_format: "png",
    // ...
  })
});
```

---

## 用户体验设计

### 易用性考虑
目标用户：50 岁以上用户也能轻松使用

#### 视觉层面
- ✅ 大按钮和清晰的图标
- ✅ 明确的选中状态（边框、背景色、勾选图标）
- ✅ 渐变背景区分不同区域
- ✅ 悬停反馈（阴影、颜色变化）

#### 交互层面
- ✅ 三步式流程，每一步都很清晰
- ✅ 预设祝福语降低输入门槛
- ✅ 字符计数器提示输入限制
- ✅ 加载状态显示生成进度

#### 响应式设计
- ✅ 桌面端：左右分栏布局
- ✅ 移动端：上下堆叠布局
- ✅ 样式选择器：4 列 → 2 列自适应
- ✅ 分类标签：横向滚动防止换行

---

## 待完成任务

### P0 - 核心功能（当前阶段）
- ✅ Worker 组件改造
- ✅ 样式选择器组件
- ✅ 祝福语预设系统
- ✅ Hero 组件更新
- ⏳ 其他 landing page 组件更新：
  - `what.tsx` - 产品介绍
  - `how.tsx` - 使用步骤
  - `feature.tsx` - 核心功能
  - `faq.tsx` - 常见问题
  - `cta.tsx` - 行动号召
- ⏳ 端到端测试
- ⏳ 数据库：插入 effect ID=2 记录

### P1 - 用户体验优化
- ⏳ Dashboard 简化
- ⏳ 每日免费 1 credit 限制
- ⏳ 基础分享功能

### P2 - 后续优化
- ⏳ Prompt 优化（A/B 测试）
- ⏳ 祝福语移到数据库或 CMS
- ⏳ 中文祝福语支持
- ⏳ 更复杂的动画效果（Framer Motion）

---

## 技术债务

### 当前无明显技术债务

### 可优化项
1. **Prompt 优化**：当前 `stylePrompts` 是手写的，需要通过实际生成效果来优化
2. **动画效果**：使用简单的 CSS `animate-bounce`，后续可以考虑 Framer Motion
3. **祝福语管理**：硬编码在代码中，未来可以移到 CMS（如 Contentful）或数据库
4. **错误处理**：可以添加更详细的错误提示和重试机制

---

## 文件清单

### 新增文件
- `src/components/birthday-card/StyleSelector.tsx` - 样式选择器组件 (111 行)
- `src/components/birthday-card/GreetingPresets.tsx` - 祝福语预设展示组件 (92 行)
- `src/components/birthday-card/greetingPresets.ts` - 祝福语数据层 (234 行)

### 修改文件
- `src/components/replicate/text-to-image/worker.tsx` - Worker 主组件重构 (273 行)
- `src/components/landingpage/top.tsx` - Hero 区域更新 (48 行)
- `messages/en.json` - 国际化文本全面更新

### 删除文件（阶段 1）
- `src/components/replicate/img-to-video/` - 整个文件夹
- `src/app/api/predictions/img_to_video/route.ts` - 视频生成 API

---

## 部署记录

### 2025-10-22 - 阶段 1 部署
- **Commit**: `refactor: 移除视频功能，专注于图片生成`
- **部署状态**: ✅ 成功
- **Vercel URL**: https://www.birthdaycardgenerator.com

### 2025-10-22 - 阶段 2 部署（待执行）
- **待提交内容**: 核心生日卡片功能（样式选择、祝福语预设、UI 更新）
- **预期 Commit Message**: `feat: 实现生日卡片生成器核心功能`

---

## 设计决策记录

### 为什么选择 4 种风格？
- 覆盖主要使用场景：温馨（家人）、搞笑（朋友）、正式（同事）、可爱（恋人/孩子）
- 4 个选项不会让用户选择困难
- 在一行内展示完整（桌面端）

### 为什么预设 40 条祝福语？
- 每个类别 10 条，数量充足但不会太多
- 涵盖不同关系和场景
- 降低用户输入门槛，提高转化率

### 为什么使用 Prompt 增强而不是多个 AI 模型？
- 成本考虑：使用同一个 flux-schnell 模型
- 响应速度：不需要切换模型
- 灵活性：通过调整 prompt 就能改变风格
- 可维护性：prompt 文本易于修改和 A/B 测试

---

## 开发笔记

### 学习要点

#### 组件化思维
将复杂功能拆分成小组件的好处：
- 每个组件职责单一
- 便于团队协作（不同人开发不同组件）
- 易于调试（问题定位到具体组件）
- 提高代码复用率

#### 类型安全的重要性
TypeScript 的类型定义帮助我们：
- 编译时发现错误
- IDE 自动补全和提示
- 代码重构更安全
- 文档作用（类型即文档）

示例：
```typescript
// 定义类型
export type CardStyle = "warm" | "funny" | "formal" | "cute";

// 使用类型
const [selectedStyle, setSelectedStyle] = useState<CardStyle>("warm");

// 如果传入 "invalid"，TypeScript 会报错
setSelectedStyle("invalid"); // ❌ 类型错误
```

#### 用户体验优先
技术实现服务于用户体验：
- 不是为了用新技术而用新技术
- 每个设计决策都从用户角度考虑
- 快速反馈比完美动画更重要

---

## 更新日志

### 2025-10-22
- 创建此文档
- 记录阶段 1 和阶段 2 的所有实现细节
- 添加技术架构说明
- 添加设计决策记录
