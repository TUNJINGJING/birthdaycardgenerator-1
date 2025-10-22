# Birthday Card Generator - 设计灵感与系统规范

**版本**：v1.0
**设计师**：Claude
**日期**：2025-10-22

---

## 1. 设计灵感采样

### 1.1 灵感来源1：Paula Scher（波拉·谢尔）

**艺术家简介**：
Paula Scher 是 Pentagram 的首位女性合伙人，以大胆的版式设计和充满能量的视觉语言闻名。她的作品常常使用超大字体、不对称布局和高对比度色彩，创造出强烈的视觉冲击力和情感共鸣。

**核心设计语言**：
- **版式**：超大标题、字体混排、字体即图形
- **布局**：非对称、动态平衡、破格排版
- **色彩**：高饱和度、撞色、活力四射
- **情感**：乐观、热情、充满能量

**转译到生日卡片生成器**：

#### 1.1.1 版式转译
**原创元素**：Paula Scher 的海报常用超大字体作为主视觉元素，字体本身就是艺术品。

**网页实现**：
- **首页 Hero Section**：
  - 主标题使用超大字体（72-96px 桌面，48px 移动）
  - 关键词"Birthday"使用不同字重和颜色强调
  - 标题文字与背景图形融合，形成视觉焦点

  ```css
  .hero-title {
    font-size: clamp(48px, 8vw, 96px);
    font-weight: 900;
    line-height: 0.9;
    letter-spacing: -0.02em;
  }

  .hero-title .highlight {
    color: var(--accent-color);
    font-style: italic;
    position: relative;
  }
  ```

- **步骤指示器**：
  - 使用大数字（48px+）作为视觉锚点
  - 数字与步骤名称形成强烈对比
  - 数字使用变量字体实现微妙动画

#### 1.1.2 布局转译
**原创元素**：非对称布局，打破传统网格，创造视觉张力。

**网页实现**：
- **首页"How It Works"模块**：
  - 3个步骤卡片不完全对齐，略有错位（视觉层次）
  - 使用对角线构图引导视线流动
  - 奇数元素向左，偶数元素向右

  ```css
  .step-card:nth-child(odd) {
    transform: translateY(-20px) rotate(-1deg);
  }

  .step-card:nth-child(even) {
    transform: translateY(20px) rotate(1deg);
  }
  ```

- **模板展示网格**：
  - 使用 Masonry 布局（瀑布流），高度不一
  - 打破传统网格的刻板感
  - 悬停时放大并恢复水平

#### 1.1.3 色彩转译
**原创元素**：高饱和度撞色，如品红+橙色+电蓝。

**网页实现**：
- **主色调**：
  - Primary: `#FF6B9D` (玫瑰粉，温暖有活力)
  - Secondary: `#FEC84E` (金黄色，欢乐阳光)
  - Accent: `#6B5CFF` (紫罗兰，优雅神秘)

- **应用规则**：
  - Primary 用于主 CTA 按钮和重要标题
  - Secondary 用于辅助元素和高亮
  - Accent 用于链接和次要按钮
  - 三种颜色在页面上形成视觉三角，引导视线

#### 1.1.4 动态效果转译
**原创元素**：虽然 Paula Scher 主要做平面设计，但她的作品充满动感。

**网页实现**：
- **标题动画**：
  - 主标题分词进场，交错200ms
  - 使用 `clip-path` 实现文字擦除效果

  ```css
  @keyframes titleReveal {
    from {
      clip-path: inset(0 100% 0 0);
      opacity: 0;
    }
    to {
      clip-path: inset(0 0 0 0);
      opacity: 1;
    }
  }
  ```

- **卡片交互**：
  - 悬停时卡片轻微旋转（±2度）
  - 阴影从扁平变为立体
  - 过渡时间 300ms，easing `cubic-bezier(0.34, 1.56, 0.64, 1)`

---

### 1.2 灵感来源2：Sonia Delaunay（索尼娅·德劳内）

**艺术家简介**：
Sonia Delaunay 是法国抽象艺术先驱，以"同时性"（Simultanism）理论闻名。她的作品使用鲜艳的色彩和几何形态，创造出充满节奏感和动感的视觉效果。她的色彩理论强调色彩之间的相互作用和情感传递。

**核心设计语言**：
- **色彩**：彩虹般的色相环、色彩渐变、色彩对比
- **形态**：同心圆、波浪曲线、色块拼接
- **节奏**：重复图案、色彩韵律、视觉音乐感
- **情感**：欢快、律动、庆典感

**转译到生日卡片生成器**：

#### 1.2.1 色彩系统转译
**原创元素**：Sonia Delaunay 的色彩理论强调色彩和谐与对比，常用彩虹色过渡。

**网页实现**：
- **风格选择卡片**：
  - **Warm 风格**：粉橙色渐变 `linear-gradient(135deg, #FFB6C1 0%, #FFA07A 50%, #FFD700 100%)`
  - **Funny 风格**：彩虹渐变 `linear-gradient(135deg, #FF6B6B 0%, #FEC84E 25%, #48C6EF 50%, #6B5CFF 75%, #FF6B9D 100%)`
  - **Formal 风格**：优雅蓝紫渐变 `linear-gradient(135deg, #667EEA 0%, #764BA2 100%)`
  - **Cute 风格**：糖果粉渐变 `linear-gradient(135deg, #FEC8D8 0%, #FFDEE9 100%)`

- **背景装饰**：
  - 使用 SVG 创建 Delaunay 风格的同心圆图案
  - 半透明叠加，不干扰主内容
  - 随滚动轻微视差移动

#### 1.2.2 几何形态转译
**原创元素**：同心圆、扇形、波浪曲线。

**网页实现**：
- **Logo 和品牌元素**：
  - Logo 使用简化的多层圆环，彩虹色
  - SVG 实现，可缩放，可动画

  ```svg
  <svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#FF6B9D" stroke-width="3"/>
    <circle cx="50" cy="50" r="35" fill="none" stroke="#FEC84E" stroke-width="3"/>
    <circle cx="50" cy="50" r="25" fill="none" stroke="#6B5CFF" stroke-width="3"/>
    <circle cx="50" cy="50" r="15" fill="#FF6B9D"/>
  </svg>
  ```

- **装饰性图形元素**：
  - 页面四角使用扇形渐变装饰
  - 步骤指示器使用圆环进度条
  - 加载动画使用旋转的同心圆

#### 1.2.3 节奏与重复转译
**原创元素**：Delaunay 的作品常用重复的色块和图案创造韵律感。

**网页实现**：
- **模板网格**：
  - 每个模板卡片的边框使用不同色彩
  - 色彩按风格分类，形成视觉分组
  - 悬停时色彩扩散到整个卡片

- **祝福语列表**：
  - 每条祝福语前使用彩色圆点装饰
  - 圆点颜色按分类变化（朋友/家人/同事）
  - 选中时圆点放大并添加光晕

#### 1.2.4 情感传递转译
**原创元素**：色彩本身传递情感，不同色相组合产生不同感受。

**网页实现**：
- **情感色彩映射**：
  - **Warm（温馨）**：橙黄色系，温暖如阳光
  - **Funny（搞笑）**：高饱和度混色，欢快跳跃
  - **Formal（正式）**：蓝紫色系，沉稳优雅
  - **Cute（可爱）**：粉色系，柔和甜美

- **动态色彩反馈**：
  - 用户选择风格时，整个页面背景渐变过渡到对应色系
  - 过渡时间 1000ms，营造沉浸感
  - 使用 CSS 变量动态切换

---

## 2. 设计系统（Design System）

### 2.1 色彩系统（Color Palette）

#### 2.1.1 基础色彩
```css
:root {
  /* Primary Colors - 主品牌色 */
  --color-primary: #FF6B9D;       /* 玫瑰粉 */
  --color-primary-light: #FFB3D1;  /* 浅玫瑰粉 */
  --color-primary-dark: #E5527E;   /* 深玫瑰粉 */

  /* Secondary Colors - 次要色 */
  --color-secondary: #FEC84E;      /* 金黄色 */
  --color-secondary-light: #FFE59E; /* 浅金黄 */
  --color-secondary-dark: #E5A72E; /* 深金黄 */

  /* Accent Colors - 强调色 */
  --color-accent: #6B5CFF;         /* 紫罗兰 */
  --color-accent-light: #9E92FF;   /* 浅紫罗兰 */
  --color-accent-dark: #5242D9;    /* 深紫罗兰 */

  /* Neutral Colors - 中性色 */
  --color-neutral-50: #FAFAFA;
  --color-neutral-100: #F5F5F5;
  --color-neutral-200: #EEEEEE;
  --color-neutral-300: #E0E0E0;
  --color-neutral-400: #BDBDBD;
  --color-neutral-500: #9E9E9E;
  --color-neutral-600: #757575;
  --color-neutral-700: #616161;
  --color-neutral-800: #424242;
  --color-neutral-900: #212121;

  /* Semantic Colors - 语义色 */
  --color-success: #4CAF50;
  --color-warning: #FF9800;
  --color-error: #F44336;
  --color-info: #2196F3;

  /* Background Colors */
  --color-bg-base: #FFFFFF;
  --color-bg-subtle: #FAFAFA;
  --color-bg-muted: #F5F5F5;

  /* Text Colors */
  --color-text-primary: #212121;
  --color-text-secondary: #616161;
  --color-text-tertiary: #9E9E9E;
  --color-text-inverse: #FFFFFF;
}
```

#### 2.1.2 风格主题色
```css
:root {
  /* Warm Theme */
  --theme-warm-gradient: linear-gradient(135deg, #FFB6C1 0%, #FFA07A 50%, #FFD700 100%);
  --theme-warm-primary: #FFB6C1;
  --theme-warm-secondary: #FFA07A;

  /* Funny Theme */
  --theme-funny-gradient: linear-gradient(135deg, #FF6B6B 0%, #FEC84E 25%, #48C6EF 50%, #6B5CFF 75%, #FF6B9D 100%);
  --theme-funny-primary: #FF6B6B;
  --theme-funny-secondary: #48C6EF;

  /* Formal Theme */
  --theme-formal-gradient: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  --theme-formal-primary: #667EEA;
  --theme-formal-secondary: #764BA2;

  /* Cute Theme */
  --theme-cute-gradient: linear-gradient(135deg, #FEC8D8 0%, #FFDEE9 100%);
  --theme-cute-primary: #FEC8D8;
  --theme-cute-secondary: #FFDEE9;
}
```

### 2.2 字体系统（Typography）

#### 2.2.1 字体栈
```css
:root {
  /* Display Font - 用于超大标题 */
  --font-display: 'Playfair Display', 'Georgia', serif;

  /* Heading Font - 用于标题 */
  --font-heading: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Body Font - 用于正文 */
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Mono Font - 用于代码/数字 */
  --font-mono: 'JetBrains Mono', 'Monaco', 'Courier New', monospace;
}
```

#### 2.2.2 字号和行高（Type Scale）
```css
:root {
  /* Font Sizes - 移动优先，使用 clamp() 实现响应式 */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);      /* 12-14px */
  --text-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);         /* 14-16px */
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);        /* 16-18px */
  --text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);       /* 18-20px */
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);        /* 20-24px */
  --text-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);             /* 24-32px */
  --text-3xl: clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem);       /* 30-40px */
  --text-4xl: clamp(2.25rem, 1.8rem + 2vw, 3rem);            /* 36-48px */
  --text-5xl: clamp(3rem, 2.25rem + 3vw, 4rem);              /* 48-64px */
  --text-6xl: clamp(3.75rem, 2.75rem + 4vw, 6rem);           /* 60-96px */

  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* Letter Spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}
```

#### 2.2.3 字体应用规范
```css
/* Hero Title */
.hero-title {
  font-family: var(--font-display);
  font-size: var(--text-6xl);
  font-weight: 900;
  line-height: var(--leading-none);
  letter-spacing: var(--tracking-tighter);
}

/* Section Heading */
.section-heading {
  font-family: var(--font-heading);
  font-size: var(--text-4xl);
  font-weight: 800;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

/* Card Title */
.card-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 700;
  line-height: var(--leading-snug);
}

/* Body Text */
.body-text {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: var(--leading-relaxed);
}

/* Caption/Small Text */
.caption {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}
```

### 2.3 栅格与间距系统（Grid & Spacing）

#### 2.3.1 栅格系统
```css
:root {
  /* Container Widths */
  --container-xs: 20rem;    /* 320px */
  --container-sm: 24rem;    /* 384px */
  --container-md: 28rem;    /* 448px */
  --container-lg: 32rem;    /* 512px */
  --container-xl: 36rem;    /* 576px */
  --container-2xl: 42rem;   /* 672px */
  --container-3xl: 48rem;   /* 768px */
  --container-4xl: 56rem;   /* 896px */
  --container-5xl: 64rem;   /* 1024px */
  --container-6xl: 72rem;   /* 1152px */
  --container-7xl: 80rem;   /* 1280px - 默认最大宽度 */

  /* Grid Columns */
  --grid-cols-1: repeat(1, minmax(0, 1fr));
  --grid-cols-2: repeat(2, minmax(0, 1fr));
  --grid-cols-3: repeat(3, minmax(0, 1fr));
  --grid-cols-4: repeat(4, minmax(0, 1fr));
  --grid-cols-6: repeat(6, minmax(0, 1fr));
  --grid-cols-12: repeat(12, minmax(0, 1fr));

  /* Grid Gaps */
  --gap-xs: 0.5rem;   /* 8px */
  --gap-sm: 0.75rem;  /* 12px */
  --gap-md: 1rem;     /* 16px */
  --gap-lg: 1.5rem;   /* 24px */
  --gap-xl: 2rem;     /* 32px */
  --gap-2xl: 3rem;    /* 48px */
}
```

#### 2.3.2 间距系统（8px 基准）
```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-7: 1.75rem;  /* 28px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-14: 3.5rem;  /* 56px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
  --space-24: 6rem;    /* 96px */
  --space-28: 7rem;    /* 112px */
  --space-32: 8rem;    /* 128px */
}
```

### 2.4 阴影系统（Shadows）

```css
:root {
  /* Elevation Shadows */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  /* Colored Shadows - 彩色阴影，增加趣味性 */
  --shadow-primary: 0 10px 30px -5px rgba(255, 107, 157, 0.3);
  --shadow-secondary: 0 10px 30px -5px rgba(254, 200, 78, 0.3);
  --shadow-accent: 0 10px 30px -5px rgba(107, 92, 255, 0.3);

  /* Inner Shadow */
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}
```

### 2.5 圆角系统（Border Radius）

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-3xl: 2rem;     /* 32px */
  --radius-full: 9999px;  /* 完全圆形 */
}
```

### 2.6 动画系统（Animations）

#### 2.6.1 过渡时长
```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --duration-slower: 500ms;
}
```

#### 2.6.2 缓动函数
```css
:root {
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);    /* Paula Scher 灵感 */
  --ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

#### 2.6.3 关键动画
```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Slide Up */
@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Rotate Spin (加载动画) */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Pulse (心跳效果) */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Bounce (弹跳效果) */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
```

---

## 3. 组件规格说明

### 3.1 按钮组件（Buttons）

#### 3.1.1 Primary Button（主按钮）
```css
.btn-primary {
  /* 尺寸 */
  padding: var(--space-4) var(--space-8);
  min-height: 56px;
  min-width: 120px;

  /* 字体 */
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: var(--tracking-wide);

  /* 颜色 */
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;

  /* 圆角和阴影 */
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-primary);

  /* 过渡 */
  transition: all var(--duration-normal) var(--ease-bounce);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl), var(--shadow-primary);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
```

**状态设计**：
- **默认**：玫瑰粉背景，白色文字，彩色阴影
- **悬停**：颜色加深，上移2px，阴影增强
- **激活**：阴影减弱，恢复原位
- **禁用**：灰色背景，禁用鼠标样式
- **加载**：显示旋转图标，禁用交互

#### 3.1.2 Secondary Button（次要按钮）
```css
.btn-secondary {
  padding: var(--space-3) var(--space-6);
  min-height: 48px;

  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: 600;

  background: var(--color-bg-base);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);

  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);

  transition: all var(--duration-normal) var(--ease-out);
}

.btn-secondary:hover {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}
```

### 3.2 卡片组件（Cards）

#### 3.2.1 Feature Card（功能卡片）
```css
.feature-card {
  /* 布局 */
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-8);

  /* 背景 */
  background: var(--color-bg-base);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-2xl);

  /* 阴影 */
  box-shadow: var(--shadow-md);

  /* 过渡 */
  transition: all var(--duration-normal) var(--ease-out);
}

.feature-card:hover {
  transform: translateY(-8px) rotate(-1deg);  /* Paula Scher 灵感 */
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary);
}

/* Icon */
.feature-card-icon {
  width: 64px;
  height: 64px;
  padding: var(--space-4);
  background: var(--theme-warm-gradient);  /* 根据主题动态切换 */
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Title */
.feature-card-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

/* Description */
.feature-card-description {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
}
```

#### 3.2.2 Template Card（模板卡片）
```css
.template-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--duration-normal) var(--ease-out);
}

.template-card:hover {
  box-shadow: var(--shadow-xl);
  transform: scale(1.02);
}

/* Thumbnail */
.template-card-thumbnail {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

/* Overlay */
.template-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--space-6);
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.template-card:hover .template-card-overlay {
  opacity: 1;
}

/* Category Tag */
.template-card-category {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  padding: var(--space-2) var(--space-4);
  background: var(--color-bg-base);
  color: var(--color-primary);
  font-size: var(--text-sm);
  font-weight: 600;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}
```

### 3.3 输入组件（Inputs）

#### 3.3.1 Text Input
```css
.input-text {
  width: 100%;
  padding: var(--space-4) var(--space-6);
  min-height: 56px;

  font-family: var(--font-body);
  font-size: var(--text-lg);
  color: var(--color-text-primary);

  background: var(--color-bg-base);
  border: 2px solid var(--color-neutral-300);
  border-radius: var(--radius-lg);

  transition: all var(--duration-fast) var(--ease-out);
}

.input-text:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(255, 107, 157, 0.1);
}

.input-text::placeholder {
  color: var(--color-text-tertiary);
}

/* Error State */
.input-text.error {
  border-color: var(--color-error);
}

.input-text.error:focus {
  box-shadow: 0 0 0 4px rgba(244, 67, 54, 0.1);
}
```

#### 3.3.2 Textarea
```css
.input-textarea {
  width: 100%;
  padding: var(--space-4) var(--space-6);
  min-height: 120px;
  resize: vertical;

  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-text-primary);

  background: var(--color-bg-base);
  border: 2px solid var(--color-neutral-300);
  border-radius: var(--radius-lg);

  transition: all var(--duration-fast) var(--ease-out);
}

.input-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(255, 107, 157, 0.1);
}
```

### 3.4 导航组件（Navigation）

#### 3.4.1 Header Navigation
```css
.header-nav {
  position: sticky;
  top: 0;
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);

  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-neutral-200);

  transition: all var(--duration-normal) var(--ease-out);
}

/* Logo */
.header-nav-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--color-text-primary);
  text-decoration: none;
}

/* Nav Links */
.header-nav-links {
  display: flex;
  gap: var(--space-6);
}

.header-nav-link {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);
}

.header-nav-link:hover {
  color: var(--color-primary);
}

.header-nav-link.active {
  color: var(--color-primary);
  position: relative;
}

.header-nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-primary);
  border-radius: var(--radius-full);
}
```

### 3.5 加载状态组件（Loading States）

#### 3.5.1 Spinner
```css
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-neutral-200);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
}

/* Delaunay 灵感的同心圆加载动画 */
.spinner-circles {
  position: relative;
  width: 64px;
  height: 64px;
}

.spinner-circles span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: var(--radius-full);
  border: 3px solid transparent;
  animation: spin 2s linear infinite;
}

.spinner-circles span:nth-child(1) {
  width: 60px;
  height: 60px;
  border-top-color: var(--color-primary);
  animation-duration: 1s;
}

.spinner-circles span:nth-child(2) {
  width: 45px;
  height: 45px;
  border-top-color: var(--color-secondary);
  animation-duration: 1.5s;
}

.spinner-circles span:nth-child(3) {
  width: 30px;
  height: 30px;
  border-top-color: var(--color-accent);
  animation-duration: 2s;
}
```

#### 3.5.2 Progress Bar
```css
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--color-neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--theme-funny-gradient);  /* 彩虹渐变，Delaunay 灵感 */
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-out);
}
```

---

## 4. 响应式设计规范

### 4.1 断点定义
```css
/* Breakpoints */
@custom-media --mobile (max-width: 767px);
@custom-media --tablet (min-width: 768px) and (max-width: 1023px);
@custom-media --desktop (min-width: 1024px);
@custom-media --wide (min-width: 1280px);
```

### 4.2 响应式策略
- **移动优先**：默认样式针对移动端，使用 `min-width` 媒体查询向上扩展
- **流式布局**：使用百分比和 `clamp()` 实现流式字号和间距
- **灵活栅格**：使用 CSS Grid 和 Flexbox 自适应布局
- **图片优化**：使用 `srcset` 和 `sizes` 属性，lazy loading

---

## 5. 可访问性规范

### 5.1 色彩对比度
- 正文与背景对比度 ≥ 4.5:1
- 大文本（≥18px）与背景对比度 ≥ 3:1
- 交互元素与背景对比度 ≥ 3:1

### 5.2 键盘导航
- 所有交互元素可通过 Tab 键访问
- 焦点状态清晰可见
- 逻辑导航顺序
- 支持 Enter/Space 键激活

### 5.3 屏幕阅读器支持
- 所有图片有 `alt` 属性
- 使用语义化 HTML 标签
- ARIA 标签适当使用（`aria-label`, `aria-describedby`）
- 动态内容更新使用 `aria-live`

### 5.4 动效可访问性
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

**下一步：交付完整的HTML/CSS/JS代码实现**
