-- ============================================================================
-- Birthday Card Generator - Complete Database Schema
-- ============================================================================
-- 用于确认数据库表结构，确保所有支付和订阅相关表已正确创建
-- 执行前请确认你的 PostgreSQL 数据库连接正常
-- ============================================================================

-- 1. 用户表 (Users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(255),
    avatar_url TEXT,
    locale VARCHAR(50),
    signin_type VARCHAR(50),
    signin_ip VARCHAR(50),
    signin_provider VARCHAR(50),
    signin_openid VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_uuid ON users(uuid);

-- ============================================================================
-- 2. 订阅计划表 (Subscription Plans)
-- ============================================================================
-- 存储 Free、Pay Once、Pro Monthly、Pro Yearly 计划配置
CREATE TABLE IF NOT EXISTS subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,                    -- 例如: "Pro Monthly", "Pay Once"
    interval VARCHAR(20) NOT NULL,                 -- 'month', 'year', 'one_time'
    price DECIMAL(10, 2) NOT NULL,                 -- 价格: 0, 4.99, 19.9, 189
    currency VARCHAR(10) DEFAULT 'USD',
    credit_per_interval INTEGER NOT NULL,          -- 每周期AI卡片额度: 3, 5, 30, 360
    stripe_price_id VARCHAR(255) UNIQUE,           -- Stripe Price ID (pk_...)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入初始计划数据（根据你的 pricing-tiers.tsx）
INSERT INTO subscription_plans (id, name, interval, price, credit_per_interval, stripe_price_id, is_active)
VALUES
    (1, 'Free', 'month', 0.00, 3, NULL, true),
    (9, 'Pay Once', 'one_time', 4.99, 5, 'price_xxx_pay_once', true),  -- 替换为实际Stripe Price ID
    (10, 'Pro Monthly', 'month', 19.9, 30, 'price_xxx_monthly', true),
    (11, 'Pro Yearly', 'year', 189.00, 360, 'price_xxx_yearly', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. 用户订阅表 (User Subscriptions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,                 -- 关联 users.uuid
    subscription_plans_id INTEGER NOT NULL,        -- 关联 subscription_plans.id
    stripe_price_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255) UNIQUE,    -- Stripe订阅ID (sub_xxx)
    stripe_customer_id VARCHAR(255),               -- Stripe客户ID (cus_xxx)
    status VARCHAR(50) NOT NULL,                   -- 'active', 'canceled', 'past_due', 'inactive'
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP,
    cancellation_reason TEXT,
    ends_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (subscription_plans_id) REFERENCES subscription_plans(id)
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_sub ON user_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- ============================================================================
-- 4. 额度使用记录表 (Credit Usage)
-- ============================================================================
-- 核心表：控制每个用户的AI卡片剩余额度
CREATE TABLE IF NOT EXISTS credit_usage (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,          -- 关联 users.uuid
    user_subscriptions_id INTEGER DEFAULT -1,      -- 关联 user_subscriptions.id, -1表示未订阅
    used_count INTEGER DEFAULT 0,                  -- 累计使用次数
    period_remain_count INTEGER DEFAULT 3,         -- ⭐ 剩余卡片数（核心限制）
    period_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    period_end TIMESTAMP,                          -- 周期结束时间（Free用户1个月后）
    is_subscription_active BOOLEAN DEFAULT false,  -- 订阅是否激活
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_credit_usage_user_id ON credit_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_usage_sub_id ON credit_usage(user_subscriptions_id);

-- ============================================================================
-- 5. 支付历史表 (Payment History)
-- ============================================================================
-- 记录所有支付事件（一次性购买 + 订阅续费）
CREATE TABLE IF NOT EXISTS payment_history (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,                 -- 关联 users.uuid
    subscription_plans_id INTEGER NOT NULL,        -- 关联 subscription_plans.id
    stripe_payment_intent_id VARCHAR(255),         -- Stripe支付意向ID (pi_xxx)
    stripe_price_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),           -- Stripe订阅ID (如果是订阅)
    stripe_customer_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL,                   -- 'started', 'submitted', 'success', 'failed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (subscription_plans_id) REFERENCES subscription_plans(id)
);

CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_stripe_pi ON payment_history(stripe_payment_intent_id);

-- ============================================================================
-- 6. AI效果模型表 (Effects)
-- ============================================================================
-- 存储可用的AI生成模型配置
CREATE TABLE IF NOT EXISTS effect (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type INTEGER,
    des TEXT,
    platform VARCHAR(100),
    link TEXT,
    api TEXT,
    is_open INTEGER DEFAULT 1,
    credit INTEGER DEFAULT 1,                      -- 每次生成消耗的credit数
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    link_name VARCHAR(255),
    model VARCHAR(255),                            -- Replicate模型名
    version VARCHAR(255),                          -- 模型版本
    pre_prompt TEXT                                -- 预设prompt
);

-- ============================================================================
-- 7. 生成结果表 (Effect Results)
-- ============================================================================
-- 记录每次AI卡片生成的结果
CREATE TABLE IF NOT EXISTS effect_result (
    id SERIAL PRIMARY KEY,
    result_id VARCHAR(255) UNIQUE NOT NULL,        -- Replicate预测ID
    original_id VARCHAR(255),
    user_id VARCHAR(255) NOT NULL,
    effect_id INTEGER NOT NULL,
    effect_name VARCHAR(255),
    prompt TEXT,
    url TEXT,                                       -- 生成图片的URL
    original_url TEXT,
    storage_type VARCHAR(50),                       -- 'r2', 's3', 'replicate'
    running_time INTEGER,                           -- 生成耗时（秒）
    credit INTEGER DEFAULT 1,                       -- 消耗的credit数
    request_params TEXT,                            -- JSON格式的请求参数
    status VARCHAR(50),                             -- 'processing', 'succeeded', 'failed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (effect_id) REFERENCES effect(id)
);

CREATE INDEX IF NOT EXISTS idx_effect_result_user_id ON effect_result(user_id);
CREATE INDEX IF NOT EXISTS idx_effect_result_result_id ON effect_result(result_id);
CREATE INDEX IF NOT EXISTS idx_effect_result_status ON effect_result(status);

-- ============================================================================
-- 8. 订阅取消记录表 (Cancel History) - 可选
-- ============================================================================
CREATE TABLE IF NOT EXISTS cancel_history (
    id SERIAL PRIMARY KEY,
    subscription_id INTEGER,                        -- 关联 user_subscriptions.id
    user_id VARCHAR(255) NOT NULL,
    cancellation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    effective_end_date TIMESTAMP,                   -- 实际结束服务日期
    reason TEXT,
    type VARCHAR(50),                               -- 'immediate', 'end_of_period'
    amount DECIMAL(10, 2),                          -- 退款金额
    status VARCHAR(50),                             -- 'pending', 'refunded', 'completed'
    stripe_refund_id VARCHAR(255),
    feedback TEXT,
    created_by VARCHAR(100),                        -- 'user' 或 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 数据库函数：自动更新 updated_at 时间戳
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 应用触发器到相关表
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_usage_updated_at BEFORE UPDATE ON credit_usage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_effect_result_updated_at BEFORE UPDATE ON effect_result
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 验证查询（执行后检查表是否创建成功）
-- ============================================================================
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public'
-- ORDER BY table_name;

-- 查看 subscription_plans 初始数据
-- SELECT * FROM subscription_plans;

-- 查看当前所有索引
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';
