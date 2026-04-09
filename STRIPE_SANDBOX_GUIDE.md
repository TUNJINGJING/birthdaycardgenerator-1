# 🧪 Stripe Sandbox (测试模式) 完整配置指南

## 📋 目录
1. [测试模式 vs 生产模式](#1-测试模式-vs-生产模式)
2. [获取Stripe测试密钥](#2-获取stripe测试密钥)
3. [创建测试Product和Price](#3-创建测试product和price)
4. [配置Webhook端点](#4-配置webhook端点)
5. [环境变量配置](#5-环境变量配置)
6. [测试流程步骤](#6-测试流程步骤)
7. [使用测试卡号](#7-使用测试卡号)
8. [验证Webhook事件](#8-验证webhook事件)
9. [切换到生产模式](#9-切换到生产模式)

---

## 1. 测试模式 vs 生产模式

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Stripe 环境对比                                   │
├──────────────────┬──────────────────────┬──────────────────────────┤
│ 项目             │ 测试模式 (Test Mode) │ 生产模式 (Live Mode)     │
├──────────────────┼──────────────────────┼──────────────────────────┤
│ 密钥前缀         │ pk_test_...          │ pk_live_...              │
│                  │ sk_test_...          │ sk_live_...              │
├──────────────────┼──────────────────────┼──────────────────────────┤
│ Webhook Secret   │ whsec_test_...       │ whsec_...                │
├──────────────────┼──────────────────────┼──────────────────────────┤
│ 真实扣款         │ ✗ 不会真实扣款       │ ✓ 真实扣款               │
├──────────────────┼──────────────────────┼──────────────────────────┤
│ 测试卡号         │ ✓ 可用               │ ✗ 不可用                 │
├──────────────────┼──────────────────────┼──────────────────────────┤
│ 数据隔离         │ 完全独立             │ 完全独立                 │
├──────────────────┼──────────────────────┼──────────────────────────┤
│ Dashboard切换    │ 左上角切换开关       │ 左上角切换开关           │
└──────────────────┴──────────────────────┴──────────────────────────┘
```

**重要**: 测试模式和生产模式数据完全隔离，需要分别配置Product/Price/Webhook。

---

## 2. 获取Stripe测试密钥

### 步骤 1: 登录Stripe Dashboard
访问: https://dashboard.stripe.com/

### 步骤 2: 切换到测试模式
在Dashboard左上角，确认切换开关显示 **"测试模式"** (Test Mode) 状态。

### 步骤 3: 获取API密钥
导航到: **开发者 (Developers)** → **API密钥 (API keys)**

你会看到两对密钥：

```
可发布密钥 (Publishable key):
  pk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

密钥 (Secret key):
  sk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **安全提示**:
- `pk_test_` 可以暴露在前端代码中
- `sk_test_` 必须保密，只能在服务器端使用

---

## 3. 创建测试Product和Price

### 步骤 1: 创建Product (产品)

导航到: **产品目录 (Product Catalog)** → **添加产品 (Add product)**

#### 3.1 创建 "Pay Once" Product

```yaml
产品名称: Birthday Card Generator - Pay Once
描述: One-time purchase for 5 AI birthday cards
```

点击 **"添加价格"**：
```yaml
定价模式: Standard pricing (标准定价)
价格: $4.99 USD
计费周期: One time (一次性)
```

创建后，复制 **Price ID**，例如: `price_1xxxxxxxxxxxxPAYONCE`

---

#### 3.2 创建 "Pro Monthly" Product

```yaml
产品名称: Birthday Card Generator - Pro Monthly
描述: 30 AI birthday cards per month
```

添加价格：
```yaml
定价模式: Standard pricing
价格: $19.90 USD
计费周期: Monthly (按月)
```

复制 Price ID: `price_1xxxxxxxxxxxxMONTHLY`

---

#### 3.3 创建 "Pro Yearly" Product

```yaml
产品名称: Birthday Card Generator - Pro Yearly
描述: 360 AI birthday cards per year (save 21%)
```

添加价格：
```yaml
定价模式: Standard pricing
价格: $189.00 USD
计费周期: Yearly (按年)
```

复制 Price ID: `price_1xxxxxxxxxxxxYEARLY`

---

### 步骤 2: 更新数据库 subscription_plans 表

将获取的Price ID更新到数据库：

```sql
-- 更新测试环境的Stripe Price ID
UPDATE subscription_plans SET stripe_price_id = 'price_1xxxxPAYONCE' WHERE id = 9;
UPDATE subscription_plans SET stripe_price_id = 'price_1xxxxMONTHLY' WHERE id = 10;
UPDATE subscription_plans SET stripe_price_id = 'price_1xxxxYEARLY' WHERE id = 11;
```

或者在代码中的 `pricing-tiers.tsx` 中也可以配置（如果代码中硬编码了Price ID）。

---

## 4. 配置Webhook端点

Webhook用于接收Stripe的支付事件通知（支付成功、订阅续费等）。

### 方法A: 本地开发测试 (使用 Stripe CLI)

#### 安装Stripe CLI

**macOS**:
```bash
brew install stripe/stripe-cli/stripe
```

**Windows**:
下载安装: https://github.com/stripe/stripe-cli/releases

**Linux**:
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

#### 登录Stripe CLI

```bash
stripe login
```

会弹出浏览器授权页面，确认授权后CLI登录成功。

#### 启动本地Webhook转发

```bash
# 启动Next.js开发服务器
npm run dev

# 在另一个终端窗口转发Webhook到本地
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

CLI会输出：
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxxx
```

**复制这个 `whsec_xxx` 到环境变量 `STRIPE_WEBHOOK_SECRET`**。

---

### 方法B: 生产环境或公网测试 (ngrok + Stripe Dashboard配置)

#### 使用ngrok暴露本地服务

```bash
# 安装ngrok (如果还没安装)
brew install ngrok  # macOS
# 或访问 https://ngrok.com/download

# 暴露本地3000端口
ngrok http 3000
```

ngrok会输出：
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

#### 在Stripe Dashboard配置Webhook

1. 导航到: **开发者** → **Webhooks** → **添加端点 (Add endpoint)**
2. 填写端点URL: `https://abc123.ngrok.io/api/webhook/stripe`
3. 选择监听事件:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
4. 点击 **"添加端点"**
5. 点击新创建的端点，复制 **"签名密钥"** (`whsec_xxx`)

---

## 5. 环境变量配置

### 创建 `.env.local` 文件

在项目根目录创建 `.env.local`（本地开发用）：

```bash
## Domain Configuration
NEXT_PUBLIC_DOMAIN="http://localhost:3000"

## PostgreSQL Database
POSTGRES_URL="postgresql://username:password@localhost:5432/birthday_card_generator"

## Google OAuth (测试用，可选)
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/callback/google"

## ⭐ Stripe 测试密钥 (Test Mode Keys)
STRIPE_PUBLIC_KEY="pk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
STRIPE_PRIVATE_KEY="sk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxxxxxxxx"  # 从Stripe CLI或Dashboard获取
WEB_BASE_URI="http://localhost:3000"

## NextAuth Secret (生成命令: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret-here"

## Replicate API (AI图片生成)
REPLICATE_API_TOKEN="r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
REPLICATE_WEBHOOK_SECRET="your-replicate-webhook-secret"
REPLICATE_URL="http://localhost:3000"

## Cloudflare R2 (可选，用于图片存储)
R2_BUCKET_NAME="your-bucket-name"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_TOKEN="your-token"
R2_ENDPOINT="https://xxxxx.r2.cloudflarestorage.com"
R2_ACCOUNT_ID="your-account-id"
```

### 验证环境变量加载

在代码中添加调试日志（临时）：

```typescript
// src/app/api/checkout/route.ts
console.log('Stripe Key:', process.env.STRIPE_PRIVATE_KEY?.substring(0, 20) + '...');
console.log('Webhook Secret:', process.env.STRIPE_WEBHOOK_SECRET ? 'Loaded' : 'Missing');
```

---

## 6. 测试流程步骤

### 完整测试流程

#### 1️⃣ 启动开发环境

```bash
# Terminal 1: 启动Next.js
npm run dev

# Terminal 2: 启动Stripe Webhook转发 (如果使用CLI)
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

#### 2️⃣ 访问应用并登录

访问: http://localhost:3000

使用Google登录（或你配置的登录方式）。

#### 3️⃣ 检查初始Credit额度

登录后，应该自动获得3张免费AI卡片（查看数据库 `credit_usage` 表）：

```sql
SELECT user_id, period_remain_count, is_subscription_active
FROM credit_usage
WHERE user_id = 'your-user-uuid';
```

预期结果:
```
period_remain_count: 3
is_subscription_active: false
```

#### 4️⃣ 测试 Pay Once (一次性购买)

1. 访问 Pricing 页面
2. 点击 **"Pay Once"** 的 **"Get Started"** 按钮
3. 跳转到Stripe Checkout页面
4. 使用测试卡号填写 (见下一节)
5. 完成支付

**预期结果**:
- Webhook接收到 `checkout.session.completed` 事件
- `credit_usage.period_remain_count` 增加5张
- `payment_history` 表新增一条 `status='success'` 记录
- `is_subscription_active` 保持 `false`

#### 5️⃣ 测试 Pro Monthly (月订阅)

1. 访问 Pricing 页面
2. 点击 **"Pro Monthly"** 的 **"Get Started"**
3. 完成Stripe支付
4. 检查Webhook事件

**预期结果**:
- 接收 `customer.subscription.created` 和 `customer.subscription.updated`
- `credit_usage.period_remain_count` 重置为30
- `is_subscription_active` 变为 `true`
- `user_subscriptions` 表新增订阅记录

#### 6️⃣ 测试订阅取消

在Stripe Dashboard中:
1. **客户 (Customers)** → 选择测试客户
2. **订阅 (Subscriptions)** → **取消订阅**

**预期结果**:
- 接收 `customer.subscription.deleted` 事件
- `user_subscriptions.status` 变为 `canceled`

---

## 7. 使用测试卡号

Stripe提供多种测试卡号来模拟不同场景：

### ✅ 成功支付

```
卡号:       4242 4242 4242 4242
过期日期:   任意未来日期 (例如 12/34)
CVC:        任意3位数字 (例如 123)
邮编:       任意5位数字 (例如 12345)
```

### ⚠️ 需要3D验证 (Strong Customer Authentication)

```
卡号:       4000 0025 0000 3155
```

支付时会弹出3D验证界面，点击 **"Complete"** 完成验证。

### ❌ 支付被拒绝

```
通用拒绝:    4000 0000 0000 0002
余额不足:    4000 0000 0000 9995
被盗卡:      4000 0000 0000 9979
```

### 🔄 其他测试场景

```
过期卡:      4000 0000 0000 0069
处理错误:    4000 0000 0000 0119
```

完整列表: https://stripe.com/docs/testing#cards

---

## 8. 验证Webhook事件

### 在Stripe Dashboard查看事件

**开发者** → **事件 (Events)** → **所有事件**

查看最近的Webhook事件：
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`

### 在Stripe CLI查看日志

如果使用 `stripe listen`，终端会实时显示所有Webhook事件：

```
2024-02-06 10:30:45   --> checkout.session.completed [evt_xxx]
2024-02-06 10:30:46   <--  [200] POST http://localhost:3000/api/webhook/stripe
```

### 在代码中添加日志

在 `/src/app/api/webhook/stripe/route.ts` 中：

```typescript
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  console.log('🎯 Received Stripe Webhook');
  console.log('Signature:', signature?.substring(0, 30) + '...');

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('✅ Event Type:', event.type);
    console.log('📦 Event Data:', JSON.stringify(event.data, null, 2));

    // ... 处理逻辑
  } catch (err) {
    console.error('❌ Webhook Error:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
```

---

## 9. 切换到生产模式

### 完成测试后的步骤

#### 1️⃣ 提交税务表单

Stripe要求激活Live模式前完成税务信息。

**设置** → **公司信息 (Business settings)** → 完成表单

#### 2️⃣ 获取生产密钥

在Dashboard左上角切换到 **"生产模式 (Live Mode)"**

**开发者** → **API密钥**

复制生产环境密钥：
```
pk_live_51xxxxx...
sk_live_51xxxxx...
```

#### 3️⃣ 重新创建Product和Price (生产环境)

⚠️ **重要**: 测试模式的Product/Price ID在生产模式不可用，需要重新创建！

重复 [步骤3](#3-创建测试product和price)，在Live Mode下创建相同的产品和价格。

#### 4️⃣ 配置生产Webhook

在Live Mode下：
**开发者** → **Webhooks** → **添加端点**

端点URL: `https://birthdaycardgenerator.com/api/webhook/stripe`

监听相同事件，复制新的生产 `whsec_xxx`。

#### 5️⃣ 更新环境变量

在生产服务器（Vercel/AWS等）更新环境变量：

```bash
STRIPE_PUBLIC_KEY=pk_live_51xxxxx...
STRIPE_PRIVATE_KEY=sk_live_51xxxxx...
STRIPE_WEBHOOK_SECRET=whsec_xxxxx...  # 生产Webhook Secret
```

#### 6️⃣ 更新数据库 subscription_plans

```sql
-- 更新生产环境的Stripe Price ID
UPDATE subscription_plans SET stripe_price_id = 'price_live_1xxxPAYONCE' WHERE id = 9;
UPDATE subscription_plans SET stripe_price_id = 'price_live_1xxxMONTHLY' WHERE id = 10;
UPDATE subscription_plans SET stripe_price_id = 'price_live_1xxxYEARLY' WHERE id = 11;
```

#### 7️⃣ 测试生产支付

使用**真实信用卡**进行小额测试（$4.99），确认：
- ✅ 支付成功
- ✅ Webhook触发
- ✅ Credit额度增加
- ✅ 数据库记录正确

---

## 📊 测试检查清单

使用这个清单确保所有功能正常：

```
□ 环境变量已正确配置 (.env.local)
□ 数据库表已创建 (执行 database-schema.sql)
□ subscription_plans 表已插入4个计划
□ Stripe测试Product已创建 (Pay Once, Pro Monthly, Pro Yearly)
□ Stripe Price ID已更新到数据库
□ Webhook端点已配置 (Stripe CLI 或 ngrok)
□ STRIPE_WEBHOOK_SECRET已设置

测试流程:
□ 新用户注册后自动获得3张免费卡片
□ Pay Once购买成功，额度+5，订阅状态保持false
□ Pro Monthly订阅成功，额度重置为30，订阅状态变true
□ Pro Yearly订阅成功，额度重置为360
□ 生成AI卡片时正确扣除额度
□ 额度不足时显示升级提示 (HTTP 402)
□ 订阅取消事件正确处理
□ Webhook签名验证通过
□ payment_history记录完整

切换生产:
□ 生产Product/Price已创建
□ 生产Webhook已配置
□ 生产环境变量已设置
□ 数据库Price ID已更新为生产版本
□ 真实支付测试通过
```

---

## 🆘 常见问题

### Q1: Webhook一直返回401/400错误？

**原因**: `STRIPE_WEBHOOK_SECRET` 不匹配。

**解决**:
1. 确认 `.env.local` 中的secret是最新的
2. 重启Next.js服务器 (`npm run dev`)
3. 如果使用Stripe CLI，重新运行 `stripe listen`

### Q2: 支付成功但数据库没更新？

**检查**:
1. 查看Webhook事件是否触发 (Stripe Dashboard → Events)
2. 查看服务器日志是否有错误
3. 检查 `metadata` 字段是否正确传递 (`userId`, `credit`, `subscriptionPlanId`)

### Q3: 测试卡号支付一直转圈？

**原因**: Webhook端点无法访问。

**解决**:
- 确认 `stripe listen` 正在运行
- 确认ngrok URL仍然有效（ngrok免费版会定期变更URL）

### Q4: 订阅续费没有自动触发？

Stripe测试模式可以加速时间：

```bash
# 在Stripe Dashboard中触发测试订阅续费
# Customers → 选择客户 → Subscriptions → "···" 菜单 → "Update subscription" → "Advance time"
```

---

## 📚 参考文档

- [Stripe测试模式文档](https://stripe.com/docs/testing)
- [Stripe Webhook指南](https://stripe.com/docs/webhooks)
- [Stripe CLI文档](https://stripe.com/docs/stripe-cli)
- [测试卡号列表](https://stripe.com/docs/testing#cards)
- [Stripe订阅生命周期](https://stripe.com/docs/billing/subscriptions/overview)

---

## ✅ 完成测试后

测试通过后，你就可以安全地切换到生产模式，开始真实收款了！

记得在上线前：
1. 移除所有调试日志
2. 设置Stripe Dashboard通知邮箱
3. 配置支付失败重试策略
4. 设置客户支持邮箱

祝你的Birthday Card Generator变现成功！🎉
