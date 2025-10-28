-- ============================================
-- 为搜索功能添加必要字段
-- 执行方法：在 Supabase Dashboard → SQL Editor 中运行
-- ============================================

-- 给 businesses 添加 calendly_url（预约链接）
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS calendly_url TEXT;

-- 给 specialists 添加 phone 和 calendly_url
ALTER TABLE specialists 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS calendly_url TEXT;

-- 添加索引以优化搜索性能
CREATE INDEX IF NOT EXISTS idx_businesses_name ON businesses USING gin(to_tsvector('simple', name));
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_specialists_name ON specialists USING gin(to_tsvector('simple', name));
CREATE INDEX IF NOT EXISTS idx_specialists_intro ON specialists USING gin(to_tsvector('simple', intro));

-- 验证字段已添加
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('businesses', 'specialists')
  AND column_name IN ('calendly_url', 'phone')
ORDER BY table_name, column_name;


