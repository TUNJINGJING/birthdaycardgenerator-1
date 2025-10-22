# Birthday Card Generator - PRD（产品需求文档）

**版本**：v1.0 MVP
**日期**：2025-10-22
**产品经理**：Claude
**目标发布日期**：2025-11-15

---

## 1. 产品目标

### 1.1 核心目标
创建一个专为全年龄段用户设计的 AI 驱动生日卡片生成器，让用户在3分钟内完成专业级生日卡片制作，无需任何设计经验。

### 1.2 成功指标（KPI）
- **用户体验**：50岁用户3分钟内完成率 > 90%
- **易用性**：新用户首次使用成功率 > 85%
- **满意度**：用户满意度评分 > 4.5/5
- **技术性能**：AI生成时间 < 30秒，页面加载 < 3秒
- **市场目标**：上线后1个月内获得1000个独立访客

---

## 2. 目标用户

### 2.1 主要用户画像：全年龄段家庭用户（核心）

**基本信息**：
- 年龄：30-55岁
- 地域：美国、英国、加拿大、澳大利亚（英语国家）
- 职业：家庭主妇/主夫、职场人士、自由职业者
- 技术水平：中等偏低，习惯使用社交媒体但不熟悉专业设计工具

**特征**：
- 重视家庭关系和情感表达
- 为家人朋友制作生日卡片
- 对易用性要求极高
- 情感价值敏感度高
- 愿意为情感产品付费，但价格敏感

**痛点**：
- 找不到既简单又有创意的工具
- 现有设计工具太复杂，学习成本高
- 模板千篇一律，缺乏个性化
- 临时需求，没时间慢慢学习

**需求**：
- 极其简单的操作界面
- 温馨感人的设计风格
- 清晰的引导和提示
- 快速生成和分享

### 2.2 次要用户画像：社交媒体活跃用户

**基本信息**：
- 年龄：18-35岁
- 特征：追求个性化，移动端为主

**需求**：
- 快速制作吸睛的生日卡片
- 支持社交媒体尺寸
- 足够的创意选项

---

## 3. 功能需求（按 MoSCoW 优先级）

### 3.1 Must Have（必须有 - MVP v1.0）

#### M1: 极简首页和主导航
**功能描述**：
- 清晰的价值主张和行动号召
- 大字体、高对比度设计
- 显著的"开始制作"按钮
- 简单的导航结构（首页、制作、登录）

**验收标准**：
- 50岁用户能在5秒内理解产品功能
- 首屏加载时间 < 3秒
- 移动端和桌面端完美适配

#### M2: AI 卡片生成核心流程
**功能描述**：
- **步骤1**：风格选择（温馨/搞笑/正式/可爱）
  - 4个大卡片，带视觉预览
  - 每个风格配有简单说明文字

- **步骤2**：文字输入
  - 预设祝福语选择（下拉或卡片选择）
  - 自定义文字输入框
  - 收件人姓名输入（可选）

- **步骤3**：生成和下载
  - 点击"生成卡片"按钮
  - 显示生成进度（加载动画 + 百分比）
  - 生成完成后显示预览
  - 下载按钮（PNG格式）
  - 分享按钮（可选）

**验收标准**：
- 从首页到完成卡片，步骤不超过5次点击
- AI生成时间 < 30秒（90%的情况）
- 生成失败时有明确错误提示和重试按钮
- 所有按钮可点击区域 ≥ 44×44px

#### M3: 预制模板系统（基础版）
**功能描述**：
- 20个精选静态模板
- 简单分类：朋友（8个）、家人（8个）、同事（4个）
- 模板卡片展示（缩略图 + 名称）
- 点击模板后进入文字编辑流程

**验收标准**：
- 模板加载时间 < 2秒
- 缩略图清晰，适配各屏幕尺寸
- 模板选择后能够进入文字编辑

#### M4: 预设祝福语库
**功能描述**：
- 50条精心挑选的英文生日祝福语
- 分类：朋友、家人、同事、通用
- 搜索/筛选功能（简化版）
- 点击即可应用到卡片

**数据示例**：
```
Friends:
- "Happy Birthday! May your day be filled with love and laughter!"
- "Wishing you a day as special as you are! Happy Birthday!"
- "Another year older, but still looking fabulous! Have a great one!"

Family:
- "Happy Birthday to the most wonderful [Mom/Dad/Brother/Sister]!"
- "May your birthday be as warm and bright as your heart!"
- "Celebrating you today and always. Love you so much!"

Colleagues:
- "Happy Birthday! Wishing you success and happiness in the year ahead!"
- "Hope your birthday is as amazing as you are. Enjoy your special day!"
- "Happy Birthday! Here's to another year of great achievements!"
```

#### M5: 实时预览和下载
**功能描述**：
- 在编辑过程中实时显示卡片预览
- 生成完成后全屏预览
- 下载按钮（PNG格式，1080×1080px）
- 下载后引导分享（可选）

**验收标准**：
- 预览图与最终下载图一致
- 下载速度 < 3秒
- 下载文件命名清晰（如：birthday-card-2025-10-22.png）

### 3.2 Should Have（应该有 - v1.1，2周内）

#### S1: 用户系统（简化版）
**功能描述**：
- Google OAuth 快速登录
- 无需注册，首次使用可直接体验
- 登录后显示用户头像和昵称
- 简化的用户仪表板

**验收标准**：
- Google 登录流程 < 10秒
- 登录状态持久化
- 退出登录功能正常

#### S2: 历史记录管理
**功能描述**：
- 查看已生成的卡片
- 重新下载历史卡片
- 删除历史记录
- 最多保存10条历史记录（免费版）

**验收标准**：
- 历史记录加载 < 2秒
- 卡片预览清晰
- 删除功能正常

#### S3: 每日免费额度限制
**功能描述**：
- 未登录用户：每天1张免费
- 已登录用户：每天1张免费
- 额度用完后显示升级提示（暂不实现付费）
- 额度每日凌晨重置

**验收标准**：
- 额度计数准确
- 额度用完后无法生成，提示清晰
- 重置时间准确

#### S4: 基础分享功能
**功能描述**：
- 生成分享链接（查看卡片）
- 复制链接到剪贴板
- 分享链接有效期30天
- 社交媒体分享引导（图标按钮）

**验收标准**：
- 分享链接可正常访问
- 复制功能正常，有成功提示
- 分享链接在移动端适配良好

### 3.3 Could Have（可以有 - v2.0，1-2个月后）

#### C1: 高级文字样式
- 文字颜色自定义
- 文字大小调整
- 文字位置拖拽
- 文字阴影效果

#### C2: 更多模板
- 扩展到50个模板
- 按节日分类（生日、纪念日等）
- 季节性模板

#### C3: 社交媒体直接分享
- 一键分享到 Facebook
- 一键分享到 Instagram
- 一键分享到 Twitter

#### C4: 付费订阅系统
- 月度/年度订阅
- Stripe 支付集成
- 订阅管理界面

### 3.4 Won't Have（暂不实现）

- 视频贺卡功能
- 批量生成功能
- 多语言支持（MVP 仅英语）
- 打印服务整合
- 团队协作功能

---

## 4. 信息架构

### 4.1 网站地图

```
Birthday Card Generator
│
├── 首页 (/)
│   ├── Hero Section（价值主张 + CTA）
│   ├── 功能介绍（3步流程）
│   ├── 模板展示（精选6个）
│   ├── 用户评价（可选）
│   └── FAQ（常见问题）
│
├── 制作页面 (/create)
│   ├── 步骤1：选择方式（AI生成 / 模板）
│   ├── 步骤2：风格/模板选择
│   ├── 步骤3：文字编辑
│   └── 步骤4：预览和下载
│
├── 模板库 (/templates)
│   ├── 分类筛选（朋友/家人/同事）
│   ├── 模板网格展示
│   └── 模板详情预览
│
├── 用户中心 (/dashboard) - v1.1
│   ├── 我的卡片（历史记录）
│   ├── 账户信息
│   └── 使用统计
│
└── 静态页面
    ├── 关于我们 (/about)
    ├── 隐私政策 (/privacy)
    └── 使用条款 (/terms)
```

### 4.2 核心任务流程

#### 流程1：首次用户快速生成卡片（AI生成）

```
[首页]
  → 点击"开始制作"按钮

[制作页面 - 步骤1]
  → 选择"AI生成"

[制作页面 - 步骤2]
  → 选择风格（温馨）
  → 系统自动跳转到下一步

[制作页面 - 步骤3]
  → 选择预设祝福语 或 输入自定义文字
  → 输入收件人姓名（可选）
  → 点击"生成卡片"

[生成中]
  → 显示加载动画和进度
  → 预计30秒

[生成完成]
  → 显示卡片预览
  → 点击"下载"按钮

[下载完成]
  → 提示下载成功
  → 引导注册/登录（可跳过）
  → 引导分享（可跳过）
```

**时间预估**：2-3分钟
**点击次数**：5-7次

#### 流程2：使用模板快速生成卡片

```
[首页]
  → 点击"浏览模板"

[模板库页面]
  → 选择分类（朋友）
  → 点击某个模板

[模板预览]
  → 查看模板详情
  → 点击"使用这个模板"

[文字编辑页面]
  → 添加文字
  → 点击"应用"

[预览页面]
  → 点击"下载"
```

**时间预估**：1-2分钟
**点击次数**：4-6次

#### 流程3：已登录用户查看历史记录

```
[首页]
  → 点击用户头像

[用户中心]
  → 点击"我的卡片"

[历史记录列表]
  → 点击某张卡片

[卡片详情]
  → 点击"重新下载"
```

---

## 5. 功能规格详细说明

### 5.1 首页（Homepage）

#### 5.1.1 Hero Section
**布局**：
- 全屏或半屏高度
- 居中对齐
- 左侧：标题 + 副标题 + CTA 按钮
- 右侧：示例卡片图片（3-4张轮播）

**文案**：
- **主标题**：Create Unique Birthday Cards in 3 Minutes
- **副标题**：No design skills needed. Powered by AI. Perfect for all ages.
- **CTA按钮**：Start Creating（大按钮，明显颜色）

**设计要求**：
- 主标题字体：48-64px（桌面），32-40px（移动）
- 按钮尺寸：至少 56px 高度
- 背景：渐变或纯色，保持简洁

#### 5.1.2 功能介绍（How It Works）
**布局**：
- 3列卡片（桌面），单列（移动）
- 每列：图标 + 标题 + 描述

**内容**：
1. **Choose Your Style**
   - Icon: 调色板图标
   - Description: Select from Warm, Funny, Formal, or Cute styles

2. **Add Your Message**
   - Icon: 文字图标
   - Description: Pick from 50+ preset greetings or write your own

3. **Download & Share**
   - Icon: 下载图标
   - Description: Get your unique card in seconds and share with loved ones

#### 5.1.3 模板展示
**布局**：
- 标题："Browse Our Templates" + "View All"链接
- 2×3 网格（桌面），单列（移动）
- 每个模板卡片：缩略图 + 分类标签

**交互**：
- 悬停时显示"Use This Template"按钮
- 点击跳转到文字编辑页面

#### 5.1.4 FAQ Section
**内容**（精选5个问题）：
1. Is it really free?
2. Do I need to sign up?
3. How long does it take to generate a card?
4. Can I download the card in high quality?
5. Can I use the cards commercially?

**布局**：
- 手风琴展开/收起
- 默认显示问题，点击展开答案

### 5.2 制作页面（Create Page）

#### 5.2.1 页面布局
**整体结构**：
- 左侧：编辑区（60%宽度）
- 右侧：实时预览区（40%宽度）
- 顶部：步骤指示器（Step 1 of 4）
- 底部：上一步 / 下一步按钮

**响应式**：
- 移动端：上下排列，预览区固定在底部

#### 5.2.2 步骤1：选择方式
**选项**：
- [大卡片] AI Generate
  - 图标 + 标题 + 描述
  - "Let AI create a unique card for you"

- [大卡片] Use Template
  - 图标 + 标题 + 描述
  - "Choose from 20 pre-designed templates"

**交互**：
- 点击任一卡片，跳转到对应流程

#### 5.2.3 步骤2：风格选择（AI生成路径）
**选项**：
- [卡片] Warm & Cozy
  - 预览图：温馨柔和的色调
  - 描述：Perfect for family and close friends

- [卡片] Funny & Playful
  - 预览图：明亮活泼的色调
  - 描述：Bring a smile with cheerful designs

- [卡片] Formal & Elegant
  - 预览图：优雅正式的色调
  - 描述：Professional birthday wishes

- [卡片] Cute & Adorable
  - 预览图：可爱柔和的色调
  - 描述：Sweet and charming for loved ones

**交互**：
- 点击选中高亮
- 点击"Next"进入文字编辑

#### 5.2.4 步骤3：文字编辑
**布局**：
- 顶部：选项卡（Preset Messages / Custom Message）
- Preset Messages tab:
  - 分类下拉（Friends/Family/Colleagues）
  - 祝福语列表（卡片式，每个显示完整文字）
  - 点击选中高亮

- Custom Message tab:
  - 大文本框（多行输入）
  - 字数统计（0/200）
  - 可选：收件人姓名输入框

**交互**：
- 选中预设祝福语后自动填充到预览区
- 自定义输入实时更新预览区
- 点击"Generate Card"进入生成流程

#### 5.2.5 步骤4：生成和预览
**生成中状态**：
- 全屏遮罩 + 加载动画
- 进度文字："Generating your unique card... 67%"
- 预计时间提示："This usually takes 20-30 seconds"

**生成完成状态**：
- 全屏卡片预览
- 底部按钮栏：
  - [主按钮] Download (PNG)
  - [次要按钮] Share Link
  - [次要按钮] Create Another

**交互**：
- 下载后显示成功提示
- 未登录用户：引导注册（可跳过）

---

## 6. 数据结构

### 6.1 核心数据模型

#### CardTemplate（卡片模板）
```typescript
interface CardTemplate {
  id: number;
  name: string;
  category: 'friends' | 'family' | 'colleagues';
  style: 'warm' | 'funny' | 'formal' | 'cute';
  thumbnailUrl: string;
  previewUrl: string;
  promptTemplate?: string; // AI生成用
  isActive: boolean;
  usageCount: number;
  createdAt: Date;
}
```

#### GreetingTemplate（祝福语模板）
```typescript
interface GreetingTemplate {
  id: number;
  category: 'friends' | 'family' | 'colleagues' | 'general';
  content: string;
  language: 'en';
  usageCount: number;
  isActive: boolean;
}
```

#### UserCardDesign（用户卡片设计）
```typescript
interface UserCardDesign {
  id: string;
  userId?: string; // 可选，未登录用户为空
  templateId?: number; // 可选，AI生成时为空
  styleType: 'warm' | 'funny' | 'formal' | 'cute';
  customText: string;
  recipientName?: string;
  generatedImageUrl: string;
  shareToken?: string;
  createdAt: Date;
}
```

#### CreditUsage（使用额度）
```typescript
interface CreditUsage {
  id: number;
  userId: string;
  usedCount: number;
  periodStart: Date;
  periodEnd: Date;
  remainCount: number;
}
```

---

## 7. 非功能需求

### 7.1 性能要求
- 首屏加载时间（LCP）< 3秒
- AI生成时间 < 30秒（90%的情况）
- 交互响应时间 < 200ms
- 页面切换时间 < 500ms

### 7.2 可访问性要求
- 符合 WCAG 2.1 AA 标准
- 所有交互元素可键盘导航
- 所有图片有 alt 文本
- 颜色对比度 ≥ 4.5:1（文字）
- 支持屏幕阅读器

### 7.3 浏览器兼容性
- Chrome 最近2个版本
- Firefox 最近2个版本
- Safari 最近2个版本
- Edge 最近2个版本
- 移动端：iOS Safari, Chrome Mobile

### 7.4 响应式设计断点
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### 7.5 SEO要求
- 所有页面有唯一的 title 和 meta description
- 使用语义化 HTML 标签
- 结构化数据标记（Schema.org）
- Sitemap 和 robots.txt
- Open Graph 标签（社交媒体分享）

---

## 8. 边界条件和异常处理

### 8.1 输入验证
- 自定义文字长度：1-200字符
- 收件人姓名长度：1-50字符
- 特殊字符过滤：禁止 < > & 等HTML字符
- 敏感词过滤（基础版）

### 8.2 错误场景
| 场景 | 错误提示 | 处理方式 |
|------|---------|---------|
| AI生成失败 | "Oops! Something went wrong. Please try again." | 显示重试按钮 |
| 网络超时 | "Connection timeout. Please check your network." | 显示重试按钮 |
| 额度用完 | "Daily limit reached. Sign up to get more free cards!" | 引导注册 |
| 无效输入 | "Please enter a message (1-200 characters)" | 高亮错误字段 |
| 下载失败 | "Download failed. Please try again." | 重试按钮 |

### 8.3 空状态
- 历史记录为空：显示"No cards yet. Create your first card!"
- 模板加载失败：显示"Unable to load templates. Please refresh."
- 搜索无结果：显示"No templates found. Try a different category."

---

## 9. 技术约束

### 9.1 现有技术栈（保留）
- **前端**：Next.js 14 + TypeScript + Tailwind CSS
- **后端**：Next.js API Routes
- **数据库**：PostgreSQL (Supabase)
- **AI服务**：Replicate API (flux-schnell 模型)
- **认证**：NextAuth.js (Google OAuth)
- **文件存储**：Cloudflare R2
- **部署**：Vercel

### 9.2 API速率限制
- Replicate API：根据订阅计划（需确认具体限制）
- 未登录用户：每IP每天1次生成
- 已登录用户：每用户每天1次生成

### 9.3 文件大小限制
- 生成图片：最大5MB
- 缩略图：最大500KB

---

## 10. 发布计划

### 10.1 MVP v1.0（当前）
**时间**：2025-10-22 - 2025-11-01（2周）
**范围**：所有 Must Have 功能

### 10.2 v1.1
**时间**：2025-11-02 - 2025-11-15（2周）
**范围**：所有 Should Have 功能

### 10.3 v2.0
**时间**：2025-11-16 - 2026-01-15（2个月）
**范围**：Could Have 功能 + 付费系统

---

## 11. 风险和依赖

### 11.1 技术风险
- **Replicate API 稳定性**：依赖第三方服务，可能出现宕机或速率限制
  - 缓解：准备备用 AI 服务商，实施重试机制

- **AI 生成质量**：可能生成不合适或低质量内容
  - 缓解：优化提示词，添加内容审核机制

### 11.2 产品风险
- **用户接受度**：用户可能不习惯 AI 生成的卡片
  - 缓解：提供模板作为备选，收集用户反馈快速迭代

- **竞争压力**：大型设计平台可能推出类似功能
  - 缓解：专注细分市场和易用性，建立品牌忠诚度

---

## 12. 附录

### 12.1 祝福语库示例（50条）

**Friends（朋友类）**：
1. Happy Birthday! May your day be filled with love and laughter!
2. Wishing you a day as special as you are! Happy Birthday!
3. Another year older, but still looking fabulous! Have a great one!
4. Hope your birthday is as amazing as you are to me!
5. Cheers to another year of wonderful memories together!
6. May all your birthday wishes come true! Enjoy your day!
7. Happy Birthday to one of my favorite people in the world!
8. Wishing you happiness and success in the year ahead!
9. Let's celebrate you today! Happy Birthday, my friend!
10. Here's to more adventures and good times ahead!

**Family（家人类）**：
11. Happy Birthday to the most wonderful Mom! Love you always!
12. Dad, you're my hero! Wishing you the best birthday ever!
13. Happy Birthday, Sis! You make life more fun every day!
14. To my amazing brother - hope your birthday is epic!
15. Grandma, you're one of a kind! Happy Birthday with love!
16. Happy Birthday, Grandpa! Thanks for all the wisdom and love!
17. Celebrating you today and always. You're the best!
18. May your birthday be as warm and bright as your heart!
19. So grateful to have you in my life. Happy Birthday!
20. Family isn't complete without you. Have a wonderful day!

**Colleagues（同事类）**：
21. Happy Birthday! Wishing you success and happiness ahead!
22. Hope your birthday is as amazing as you are. Enjoy!
23. Happy Birthday! Here's to another year of great achievements!
24. Wishing you a fantastic birthday and a wonderful year!
25. May your special day be filled with joy and celebration!
26. Happy Birthday! Thanks for being such a great colleague!
27. Hope you have a relaxing and enjoyable birthday!
28. Wishing you the best on your birthday and beyond!
29. Happy Birthday! Looking forward to another great year together!
30. Enjoy your special day - you deserve it!

**General（通用类）**：
31. Happy Birthday! Make it a day to remember!
32. Wishing you joy, love, and all good things on your birthday!
33. May this year bring you everything you've been hoping for!
34. Happy Birthday! Here's to a year full of blessings!
35. Celebrate big today - you deserve all the happiness!
36. May your birthday be the start of a wonderful new chapter!
37. Happy Birthday! Keep shining and spreading joy!
38. Wishing you a day filled with love and beautiful moments!
39. Happy Birthday! May your dreams and wishes come true!
40. Another year, another reason to celebrate how amazing you are!

**Playful/Funny（搞笑类）**：
41. Happy Birthday! Don't worry, you're not getting older - just more distinguished!
42. Age is just a number... a really big number in your case! 😄
43. Happy Birthday! Time to eat cake and pretend calories don't count!
44. Another year wiser... or at least another year older!
45. Happy Birthday! You're not old, you're vintage!
46. Congrats on leveling up! Happy Birthday!
47. Happy Birthday! May your day be filled with cake and zero adulting!
48. You're not over the hill, you're on top of the mountain! Happy Birthday!
49. Happy Birthday! Remember, you're only as old as you feel... so lie about your age!
50. Cheers to you on your birthday! Let's party like we're not as old as we actually are!

---

**文档版本历史**：
- v1.0 (2025-10-22): 初版 MVP PRD
