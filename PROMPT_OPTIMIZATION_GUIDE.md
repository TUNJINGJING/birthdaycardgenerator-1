# 🎨 生日卡片 Prompt 优化指南

## 使用 Google AI Studio 免费调试

### 访问地址
https://aistudio.google.com/

---

## 📝 Prompt 模板库

### 基础模板结构

```
[卡片风格] + [文字内容] + [视觉元素] + [质量提示]
```

---

## 🎯 按风格分类的 Prompt 模板

### 1️⃣ 温馨风格（Warm）

#### 模板 1：经典温馨
```
A warm and cozy birthday greeting card design.
Large, clear text in the center reading "Happy Birthday [Name]!".
Soft pastel colors: pink, peach, and cream.
Gentle watercolor flowers in corners.
Elegant serif font for text.
Professional greeting card style.
High quality, clean composition.
```

#### 模板 2：温馨简约
```
Birthday card with heartwarming atmosphere.
The text "Happy Birthday" displayed prominently in elegant calligraphy.
Soft lighting, warm color palette.
Minimal floral decorations on edges.
Family-friendly, tender mood.
Clear readable typography.
```

#### 测试变体（在 Gemini 中依次测试）：
- 改变文字位置：`text in the center` vs `text at the top`
- 改变字体描述：`elegant serif font` vs `modern sans-serif` vs `handwritten style`
- 改变装饰：`watercolor flowers` vs `geometric shapes` vs `bokeh lights`

---

### 2️⃣ 搞笑风格（Funny）

#### 模板 1：卡通搞笑
```
Funny and playful birthday card in cartoon style.
Bold colorful text "Happy Birthday!" with playful font.
Bright cheerful colors: red, yellow, cyan, purple.
Humorous cartoon elements and party decorations.
Energetic and joyful vibe.
Comic book style illustration.
Text should be large and very readable.
```

#### 模板 2：趣味现代
```
Birthday greeting card with funny playful design.
The words "Happy Birthday" in bubble letters.
Pop art style, vibrant colors.
Confetti and balloons in background.
Retro comic aesthetic.
Make text stand out clearly.
```

---

### 3️⃣ 正式风格（Formal）

#### 模板 1：商务正式
```
Elegant and formal birthday card design.
Sophisticated typography with text "Happy Birthday".
Professional color scheme: navy blue, gold, and white.
Minimalist geometric patterns.
Classy celebration theme.
Premium greeting card quality.
Text must be perfectly legible.
```

#### 模板 2：奢华正式
```
Luxurious birthday greeting card.
Gold foil effect text reading "Happy Birthday".
Deep burgundy and gold color palette.
Art deco style borders.
Refined and elegant aesthetic.
High-end professional design.
```

---

### 4️⃣ 可爱风格（Cute）

#### 模板 1：甜美可爱
```
Cute and adorable birthday card design.
Sweet pastel colors: baby pink, lavender, mint.
The text "Happy Birthday!" in rounded friendly font.
Kawaii style illustrations.
Charming small decorative elements.
Soft and lovely atmosphere.
Text should be clear and cute.
```

#### 模板 2：童趣可爱
```
Birthday card with cute whimsical theme.
Playful text "Happy Birthday" in bubbly letters.
Pastel rainbow colors.
Sweet illustrated elements like stars and hearts.
Cheerful and innocent vibe.
Children's book illustration style.
```

---

## 🔧 文字渲染优化技巧

### 关键词清单（增强文字质量）

在 prompt 中加入这些关键词可以提升文字渲染效果：

#### 文字清晰度
```
- "clear readable typography"
- "text should be perfectly legible"
- "large prominent text"
- "bold easy-to-read font"
- "sharp text rendering"
```

#### 文字样式
```
- "elegant serif font" (优雅衬线体)
- "modern sans-serif" (现代无衬线)
- "handwritten calligraphy" (手写书法)
- "bold display font" (粗体展示字体)
- "rounded friendly letters" (圆润友好字体)
```

#### 文字位置
```
- "text in the center"
- "text prominently displayed"
- "headline at the top"
- "greeting message centered"
```

#### 强调文字重要性
```
- "focus on the text"
- "text is the main element"
- "make text stand out"
- "emphasize the typography"
```

---

## 📊 测试流程

### 第 1 步：基础测试（选 1 个风格）

在 Gemini 中测试基础版本：

```
Test 1: 基础 prompt
A birthday greeting card.
Text "Happy Birthday" in center.
Warm colors and flowers.

Test 2: 加强文字描述
A birthday greeting card design.
LARGE, CLEAR text reading "Happy Birthday" prominently displayed in the center.
Elegant serif font, very readable.
Warm pastel colors with watercolor flowers.

Test 3: 进一步优化
Professional birthday greeting card.
The text "Happy Birthday" is the main focus, displayed in elegant calligraphy.
Text should be sharp and perfectly legible.
Soft warm color palette with subtle floral decorations.
High quality greeting card composition.
```

### 第 2 步：对比效果

记录每个版本的效果：
- ✅ 文字是否清晰？
- ✅ 拼写是否正确？
- ✅ 整体美观度如何？
- ✅ 风格是否符合预期？

### 第 3 步：微调优化

根据测试结果调整：
- 文字太小 → 加入 "large prominent text"
- 文字模糊 → 加入 "sharp clear typography"
- 背景太复杂 → 加入 "minimalist background"
- 颜色不对 → 明确指定颜色 "pastel pink and cream"

---

## 🎨 当前系统中的 Prompt 增强

### 现有代码中的风格前缀

你的项目已经有了这些风格前缀（`worker.tsx` 第 19-24 行）：

```typescript
const stylePrompts = {
  warm: "warm and cozy birthday celebration with soft colors, heartwarming atmosphere, gentle lighting, family-friendly, tender and affectionate mood, ",
  funny: "funny and playful birthday card with cartoon style, bright cheerful colors, humorous elements, joyful and energetic vibe, ",
  formal: "elegant and formal birthday design with sophisticated colors and typography, professional and refined aesthetic, classy celebration, ",
  cute: "cute and adorable birthday theme with pastel colors and charming elements, sweet and lovely atmosphere, kawaii style, "
};
```

### 测试时的完整 Prompt

**用户输入**：`Happy Birthday!`
**风格**：Warm

**在 Gemini 中测试**：
```
warm and cozy birthday celebration with soft colors, heartwarming atmosphere, gentle lighting, family-friendly, tender and affectionate mood, birthday card with text: "Happy Birthday!", creative typography, celebration theme, high quality design
```

---

## 💡 优化建议

### 建议 1：增强文字相关描述

修改现有的 `stylePrompts`，添加更多文字相关关键词：

```typescript
const stylePrompts = {
  warm: "warm and cozy birthday greeting card design, LARGE CLEAR TEXT prominently displayed, soft colors, heartwarming atmosphere, gentle lighting, elegant readable typography, family-friendly, tender and affectionate mood, ",

  funny: "funny and playful birthday card in cartoon style, BOLD COLORFUL TEXT with playful font, bright cheerful colors, humorous elements, joyful and energetic vibe, text should stand out clearly, ",

  formal: "elegant and formal birthday card design, SOPHISTICATED TYPOGRAPHY prominently displayed, professional color scheme, classy celebration, refined aesthetic, text must be perfectly legible, ",

  cute: "cute and adorable birthday card design, SWEET ROUNDED TEXT in friendly font, pastel colors, charming kawaii elements, lovely atmosphere, text should be clear and cute, "
};
```

### 建议 2：添加通用文字增强后缀

在 prompt 末尾统一添加：

```
, professional greeting card quality, sharp text rendering, high readability
```

---

## 📋 测试检查清单

### Gemini 调试阶段
- [ ] 测试至少 3 种不同的文字描述方式
- [ ] 测试不同的字体风格（serif, sans-serif, handwritten）
- [ ] 测试不同的文字位置（center, top, bottom）
- [ ] 确认文字清晰度和拼写准确性
- [ ] 记录效果最好的 prompt 版本

### 切换到 Ideogram 后
- [ ] 使用优化后的 prompt 生成测试图片
- [ ] 对比 Gemini 和 Ideogram 的效果差异
- [ ] 根据 Ideogram 的特性进一步微调 prompt
- [ ] 更新代码中的 stylePrompts

---

## 🔄 迭代流程

```
1. 在 Gemini 中测试基础 prompt
   ↓
2. 识别问题（文字模糊？拼写错误？风格不对？）
   ↓
3. 调整 prompt（加强关键词，改变描述）
   ↓
4. 重新测试，对比效果
   ↓
5. 重复 2-4 直到满意
   ↓
6. 应用最佳 prompt 到项目代码
   ↓
7. 切换到 Ideogram v3 Turbo 生产环境测试
```

---

## 🎯 目标效果

### 理想的生成结果应该是：
- ✅ 文字 100% 清晰可读
- ✅ 拼写完全正确
- ✅ 字体风格符合卡片主题
- ✅ 背景装饰不干扰文字
- ✅ 整体美观专业

---

## 📞 下一步

1. **现在**：去 https://aistudio.google.com/ 免费测试
2. **选择一个风格**开始测试（推荐从 Warm 开始）
3. **记录**效果最好的 prompt
4. **告诉我**测试结果，我帮你更新代码
5. **切换**到 Ideogram v3 Turbo 生产环境

---

**祝调试顺利！🎉**
