# API Security Issues — TODO

> Last updated: 2026-04-10
> Status: Pending fix

## Critical

### 1. Webhook 无签名验证
**文件:** `src/app/api/webhook/replicate/route.ts`
**问题:** 直接 `req.json()` 解析 webhook，没有验证请求是否来自 Replicate。任何人可以伪造 succeeded/failed 回调来退款或注入假图片。
**环境变量 `REPLICATE_WEBHOOK_SECRET`** 存在但代码里完全没用。
**修复方案:**
```typescript
// 在 POST handler 开头添加签名验证
const signature = req.headers.get("webhook-signature");
// 用 crypto 验证 HMAC 签名，不匹配则 reject
```

### 2. Polling API 无认证
**文件:** `src/app/api/predictions/[id]/route.ts`
**问题:** 知道 prediction ID 就能查看任何人的生成结果。
**修复方案:** 从 session 获取 user，验证该 prediction 属于当前用户。

## Medium

### 3. 无 Rate Limit
**问题:** 全局没有任何 rate limiting，可被高频请求打满。
**修复方案:** 使用 `@upstash/ratelimit` 或 Vercel KV 做 API rate limiting。

### 4. Webhook 返回永远 200
**文件:** `src/app/api/webhook/replicate/route.ts`
**问题:** 即使处理失败也返回 200，Replicate 不会重试。
**修复方案:** 处理失败时返回 500，让 Replicate 自动重试。

## Low

### 5. effect_result/update API 无认证
**文件:** `src/app/api/effect_result/update/route.ts`
**问题:** 前端直接调 update，任何人可以更新结果记录。
**影响:** 低，因为数据最终会被 webhook 覆盖。

### 6. Stripe Webhook 也应验证
**文件:** `src/app/api/webhook/stripe/route.ts`
**确认:** 检查是否用了 `stripe.webhooks.constructEvent` 验证签名。
