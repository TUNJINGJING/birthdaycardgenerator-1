# Birthday Card Generator — 项目知识库

> 生成日期: 2026-04-13
> 项目路径: /Users/lr/Documents/birthdaycardgenerator-1
> GitHub: github.com/TUNJINGJING/birthdaycardgenerator-1
> 分支: main (生产), ui-redesign (开发)
> 域名: www.birthdaycardgenerator.com
> 部署: Vercel (自动部署 main 分支)

---

## 一、项目概述

AI 生日卡片生成器。用户选择风格 → 输入/选择祝福语 → AI 生成唯一卡片 → 下载 PNG。

- **技术栈**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **国际化**: next-intl (目前只有 en)
- **AI 生成**: Replicate API (Flux 模型)
- **支付**: Stripe (订阅 + 一次性购买)
- **认证**: NextAuth (Google OAuth)
- **数据库**: PostgreSQL (Supabase)
- **存储**: Cloudflare R2
- **设计风格**: 黑白极简 (font-serif 标题, border-black, bg-[#F2F2F2])

---

## 二、目录结构

```
src/
├── app/
│   ├── [locale]/              # 国际化路由
│   │   ├── layout.tsx         # 根布局 (JSON-LD, theme-color, favicon)
│   │   ├── providers.tsx      # Provider 组合
│   │   ├── (free)/            # 路由组 (共享 Navbar + Footer)
│   │   │   ├── layout.tsx     # Navbar + Footer + Toaster 布局
│   │   │   ├── page.tsx       # 首页 (Hero + AI生成器 + Landing sections + Pricing)
│   │   │   ├── pricing/       # /pricing 页面
│   │   │   ├── dashboard/     # /dashboard 用户卡片历史
│   │   │   │   └── layout.tsx # noindex metadata
│   │   │   └── legal/         # /legal/terms-of-service, /legal/privacy-policy
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth (Google OAuth)
│   │   ├── predictions/
│   │   │   ├── text_to_image/route.ts   # POST: 创建 AI 生成任务
│   │   │   └── [id]/route.ts            # GET: 轮询任务状态
│   │   ├── webhook/
│   │   │   ├── replicate/route.ts       # Replicate 回调 (成功/失败处理)
│   │   │   └── stripe/route.ts          # Stripe 支付回调
│   │   ├── checkout/route.ts            # Stripe Checkout Session 创建
│   │   └── effect_result/update/route.ts # 更新生成结果
│   └── layout.tsx             # 最外层布局 (GA analytics)
├── backend/
│   ├── config/db.ts           # PostgreSQL 连接池
│   ├── models/                # 数据访问层
│   ├── service/               # 业务逻辑层
│   └── type/type.ts           # TypeScript 接口定义
├── components/
│   ├── replicate/text-to-image/
│   │   ├── worker-original.tsx        # 主 AI 卡片生成器组件
│   │   ├── worker-original-wraper.tsx # 服务端: 从 DB 读取 effect 配置
│   │   └── img-output-original.tsx    # 输出展示 (下载 + 分享)
│   ├── birthday-card/
│   │   ├── StyleSelector.tsx          # 4 风格选择 (warm/funny/formal/cute)
│   │   └── GreetingPresets.tsx        # 预设祝福语
│   ├── landingpage/            # 首页各 section 组件
│   ├── price/
│   │   ├── app.tsx             # Pricing 组件 (首页和 /pricing 共用)
│   │   ├── pricing-tiers.tsx   # 价格数据定义
│   │   └── pricing-types.tsx   # TypeScript 类型
│   ├── layout/navbar/          # 导航栏
│   ├── layout/footer/          # 页脚
│   └── seo/seo.tsx             # SEO metadata 生成
├── config/
│   ├── domain.ts               # 域名配置
│   └── site.ts                 # 站点信息
├── contexts/app.tsx            # 全局状态 (user, sidebar)
└── providers/session.tsx       # NextAuth session provider
```

---

## 三、AI 生成完整流程

```
1. 用户访问首页
   page.tsx → effectId="2" → WorkerOriginalWraper (服务端组件)

2. 从数据库读取 effect 配置
   WorkerOriginalWraper → getEffectById(2) → DB effect 表
   返回: model="black-forest-labs/flux-schnell", credit=1, version=null

3. 用户操作 (客户端)
   worker-original.tsx:
   - 选择风格 (warm/funny/formal/cute)
   - 输入/选择祝福语
   - 点击 Generate

4. 前端拼接 prompt
   用户输入: "Happy Birthday Mom!"
   实际 prompt: "warm and cozy birthday celebration with soft colors...birthday card with text: 'Happy Birthday Mom!', creative typography..."

5. POST /api/predictions/text_to_image
   Body: { model, version, prompt, width:1024, height:1024, user_id, user_email, credit:1 }

6. 后端处理 (route.ts)
   a. generateCheck() → 验证用户登录 + credit 足够
   b. reducePeriodRemainCountByUserId() → 预扣 credit
   c. replicate.predictions.create() → 调用 Replicate API
   d. 如果 Replicate 拒绝 → 退还 credit
   e. createEffectResult() → 写入 DB 记录
   f. 返回 prediction 对象

7. 前端轮询 (每 1.5 秒)
   GET /api/predictions/[id] → 查 Replicate 状态
   直到 status = succeeded 或 failed

8. Replicate Webhook 回调
   POST /api/webhook/replicate:
   - succeeded → 更新 DB, 图片 URL
   - failed → 退还 credit

9. 前端展示结果
   img-output-original.tsx → 显示图片 + 下载 + 分享按钮
```

---

## 四、支付系统架构

### 价格层级

| 层级 | DB plan_id | 价格 | 额度 | Stripe Price ID |
|------|-----------|------|------|----------------|
| Free | - | $0 | 3 cards/month | - |
| Pay Once | 1 | $4.99 | 5 cards (一次性) | price_1TLeOL... |
| Pro Monthly | 2 | $19.90/月 | 30 cards/month | price_1TLeOJ... |
| Pro Yearly | 5 | $189/年 | 360 cards/year | price_1TLeOD... |

### 支付流程

```
用户点 Purchase/Subscribe
    ↓
app.tsx → handleCheckout(plan_id, amount, interval)
    ↓ POST /api/checkout
checkout/route.ts:
    1. 验证用户 (user_id + email)
    2. 查 subscription_plans 表 → 拿 stripe_price_id
    3. 验证 amount 和 interval 匹配
    4. 创建 payment_history 记录 (status="started")
    5. stripe.checkout.sessions.create() → 创建支付页
    6. 返回 session.url
    ↓
前端 router.push(session.url) → 跳转 Stripe 支付页
    ↓
用户完成支付
    ↓
Stripe Webhook → POST /api/webhook/stripe:
    - checkout.session.completed (Pay Once):
      → credit_usage.period_remain_count += 5
      → payment_history.status = "success"
    - customer.subscription.updated (Pro Monthly/Yearly):
      → 创建/更新 user_subscriptions 记录
      → credit_usage 更新 (is_subscription_active=true)
      → payment_history 记录
```

### Stripe 配置

| 环境 | 说明 |
|------|------|
| Test mode | 用 pk_test_/sk_test_ + 4242 卡号测试 |
| Live mode | 用 pk_live_/sk_live_，真实交易 |

**Vercel 环境变量:**
- `STRIPE_PUBLIC_KEY` (pk_live_xxx)
- `STRIPE_PRIVATE_KEY` (sk_live_xxx)
- `STRIPE_WEBHOOK_SECRET` (whsec_xxx)

**Stripe Webhook URL:** `https://www.birthdaycardgenerator.com/api/webhook/stripe`
**Events:** checkout.session.completed, customer.subscription.updated, customer.subscription.deleted

---

## 五、数据库表结构 (Supabase PostgreSQL)

| 表名 | 作用 | 关键字段 |
|------|------|---------|
| users | 用户信息 | uuid, email, signin_provider |
| effect | AI 模型配置 | id=1(flux-1.1-pro), id=2(flux-schnell), model, version, credit |
| effect_result | 生成记录 | user_id, prompt, url, status, original_id |
| credit_usage | 用户额度 | period_remain_count, is_subscription_active, period_end |
| subscription_plans | 价格计划 | id, stripe_price_id, price, credit_per_interval, interval |
| user_subscriptions | 用户订阅 | stripe_subscription_id, status, current_period_end |
| payment_history | 支付记录 | amount, status, stripe_price_id |
| cancel_history | 取消记录 | subscription_id, reason |

**连接字符串:** `POSTGRES_URL` 环境变量 (Supabase Pooler)

---

## 六、环境变量清单 (Vercel)

| 变量名 | 说明 | 示例 |
|--------|------|------|
| NEXT_PUBLIC_DOMAIN | 网站域名 | https://www.birthdaycardgenerator.com |
| POSTGRES_URL | 数据库连接 | postgresql://postgres.xxx@aws-xxx.supabase.com |
| GOOGLE_CLIENT_ID | Google OAuth | xxx.apps.googleusercontent.com |
| GOOGLE_CLIENT_SECRET | Google OAuth | GOCSPX-xxx |
| NEXTAUTH_SECRET | NextAuth 加密 | openssl rand -base64 32 生成 |
| REPLICATE_API_TOKEN | Replicate AI | r_xxx |
| REPLICATE_URL | Webhook 域名 | https://www.birthdaycardgenerator.com |
| REPLICATE_WEBHOOK_SECRET | Webhook 签名 | (未使用,待修复) |
| STRIPE_PUBLIC_KEY | Stripe 公钥 | pk_live_xxx |
| STRIPE_PRIVATE_KEY | Stripe 私钥 | sk_live_xxx |
| STRIPE_WEBHOOK_SECRET | Stripe Webhook | whsec_xxx |
| WEB_BASE_URI | 支付成功回跳 | https://www.birthdaycardgenerator.com |
| R2_BUCKET_NAME | Cloudflare R2 | bucket-name |
| R2_ACCESS_KEY_ID | R2 访问密钥 | xxx |
| R2_SECRET_ACCESS_KEY | R2 秘密密钥 | xxx |
| R2_ENDPOINT | R2 公开 URL | https://xxx.r2.dev |
| R2_ACCOUNT_ID | R2 账户 ID | xxx |

---

## 七、SEO 配置

| 配置项 | 文件 | 内容 |
|--------|------|------|
| Sitemap | next-sitemap.config.js | 自动生成, 域名 birthdaycardgenerator.com |
| robots.txt | 自动生成 | 排除 /dashboard, /legal/*, /api/* |
| JSON-LD | layout.tsx | WebApplication schema |
| FAQ JSON-LD | page.tsx | FAQPage schema (6 个 FAQ) |
| OG Image | seo.tsx | /og-image.jpg |
| Theme Color | layout.tsx | #111111 |
| Favicon | layout.tsx | /logo.png |

---

## 八、设计规范

**黑白极简风格:**
- 标题: `font-serif text-4xl font-bold`
- 正文: `text-gray-500`
- 分隔线: `border-b border-black`
- 背景: `bg-white` 和 `bg-[#F2F2F2]` 交替
- 边框: `border border-gray-300`, hover 时 `hover:border-black`
- 按钮: `bg-black text-white`, tracking-widest uppercase
- 编号: `font-mono text-xs tracking-widest text-gray-400 uppercase`

---

## 九、常用命令

```bash
npm run dev          # 本地开发
npm run build        # 构建 (会自动运行 next-sitemap)
npm run build:prod   # 生产构建
git push origin main # 推送触发 Vercel 部署
```

---

## 十、待办事项 (API_SECURITY_ISSUES.md)

1. **Webhook 签名验证** — Replicate webhook 无签名校验 (高优先级)
2. **Polling API 认证** — /api/predictions/[id] 无需登录即可访问
3. **Rate Limiting** — 全局无请求频率限制
4. **首页 effect ID** — 当前用 id=2 (flux-schnell), 应考虑用 id=1 (flux-1.1-pro, 质量更好)
5. **OG Image** — 当前用 logo 副本, 应制作专用社交分享图
