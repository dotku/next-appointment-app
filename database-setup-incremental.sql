-- ============================================
-- Incremental Database Setup
-- Based on existing roles, profiles, profile_role tables
-- Adding businesses, specialists, services, appointments, tasks, and admin features
-- ============================================

-- ============================================
-- 1. 修改现有 profiles 表，添加缺失字段
-- ============================================
-- 确保 profiles 表有 avatar_url 字段
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

COMMENT ON COLUMN profiles.avatar_url IS 'User avatar image URL';

-- ============================================
-- 2. 创建 BUSINESSES 表
-- ============================================
CREATE TABLE IF NOT EXISTS businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    city TEXT,
    address TEXT,
    description TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    calendly_url TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE businesses IS 'Business/salon information';
COMMENT ON COLUMN businesses.logo_url IS 'Business logo image URL';
COMMENT ON COLUMN businesses.calendly_url IS 'Calendly booking link';
COMMENT ON COLUMN businesses.owner_id IS 'Business owner/creator';

-- ============================================
-- 3. 创建 SPECIALISTS 表
-- ============================================
CREATE TABLE IF NOT EXISTS specialists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID,
    name TEXT NOT NULL,
    intro TEXT,
    avatar_url TEXT,
    phone TEXT,
    calendly_url TEXT,
    availabilities INTEGER[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE specialists IS 'Specialists/service providers';
COMMENT ON COLUMN specialists.avatar_url IS 'Specialist avatar image URL';
COMMENT ON COLUMN specialists.calendly_url IS 'Calendly booking link';
COMMENT ON COLUMN specialists.phone IS 'Specialist contact phone';
COMMENT ON COLUMN specialists.availabilities IS 'Available days (0-6 for Sunday-Saturday)';

-- ============================================
-- 4. 创建 SERVICES 表
-- ============================================
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    specialist_id UUID REFERENCES specialists(id) ON DELETE CASCADE,
    user_id UUID,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    duration_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE services IS 'Services offered by businesses/specialists';

-- ============================================
-- 5. 创建 APPOINTMENTS 表
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    specialist_id UUID REFERENCES specialists(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE appointments IS 'Customer appointments';

-- ============================================
-- 6. 创建 TASKS 表
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assigned_to UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE tasks IS 'Task management';

-- ============================================
-- 7. 创建 BUSINESS_IMAGES 表（可选：多图片支持）
-- ============================================
CREATE TABLE IF NOT EXISTS business_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    image_type TEXT DEFAULT 'gallery' CHECK (image_type IN ('logo', 'cover', 'gallery')),
    display_order INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE business_images IS 'Business image gallery (multiple images support)';

-- ============================================
-- 8. 创建索引
-- ============================================
-- Profiles 索引（如果不存在）
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Businesses 索引
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_name ON businesses USING gin(to_tsvector('simple', name));

-- Specialists 索引
CREATE INDEX IF NOT EXISTS idx_specialists_profile_id ON specialists(profile_id);
CREATE INDEX IF NOT EXISTS idx_specialists_business_id ON specialists(business_id);
CREATE INDEX IF NOT EXISTS idx_specialists_phone ON specialists(phone);
CREATE INDEX IF NOT EXISTS idx_specialists_name ON specialists USING gin(to_tsvector('simple', name));

-- Services 索引
CREATE INDEX IF NOT EXISTS idx_services_business_id ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_services_specialist_id ON services(specialist_id);

-- Appointments 索引
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_business_id ON appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_specialist_id ON appointments(specialist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- Business Images 索引
CREATE INDEX IF NOT EXISTS idx_business_images_business_id ON business_images(business_id);
CREATE INDEX IF NOT EXISTS idx_business_images_type ON business_images(image_type);

-- ============================================
-- 9. 创建更新时间触发器（用于新表）
-- ============================================
-- update_updated_at_column 函数已存在，直接使用

-- 为新表创建触发器
DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
CREATE TRIGGER update_businesses_updated_at 
BEFORE UPDATE ON businesses 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_specialists_updated_at ON specialists;
CREATE TRIGGER update_specialists_updated_at 
BEFORE UPDATE ON specialists 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at 
BEFORE UPDATE ON services 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at 
BEFORE UPDATE ON appointments 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at 
BEFORE UPDATE ON tasks 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_business_images_updated_at ON business_images;
CREATE TRIGGER update_business_images_updated_at 
BEFORE UPDATE ON business_images 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. 启用 ROW LEVEL SECURITY
-- ============================================
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_images ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 11. 创建 RLS 策略
-- ============================================

-- Businesses RLS 策略
DROP POLICY IF EXISTS "Everyone can view businesses" ON businesses;
CREATE POLICY "Everyone can view businesses"
ON businesses FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Authenticated users can create businesses" ON businesses;
CREATE POLICY "Authenticated users can create businesses"
ON businesses FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Owners can update their businesses" ON businesses;
CREATE POLICY "Owners can update their businesses"
ON businesses FOR UPDATE
USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners can delete their businesses" ON businesses;
CREATE POLICY "Owners can delete their businesses"
ON businesses FOR DELETE
USING (owner_id = auth.uid());

-- Specialists RLS 策略
DROP POLICY IF EXISTS "Everyone can view specialists" ON specialists;
CREATE POLICY "Everyone can view specialists"
ON specialists FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Business owners can manage their specialists" ON specialists;
CREATE POLICY "Business owners can manage their specialists"
ON specialists FOR ALL
USING (
  business_id IN (
    SELECT id FROM businesses 
    WHERE owner_id = auth.uid()
  )
);

-- Services RLS 策略
DROP POLICY IF EXISTS "Everyone can view services" ON services;
CREATE POLICY "Everyone can view services"
ON services FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Business owners can manage their services" ON services;
CREATE POLICY "Business owners can manage their services"
ON services FOR ALL
USING (
  business_id IN (
    SELECT id FROM businesses 
    WHERE owner_id = auth.uid()
  )
);

-- Appointments RLS 策略
DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
CREATE POLICY "Users can view their own appointments"
ON appointments FOR SELECT
USING (
  customer_id = auth.uid()
  OR business_id IN (
    SELECT id FROM businesses 
    WHERE owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Authenticated users can create appointments" ON appointments;
CREATE POLICY "Authenticated users can create appointments"
ON appointments FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their own appointments" ON appointments;
CREATE POLICY "Users can update their own appointments"
ON appointments FOR UPDATE
USING (
  customer_id = auth.uid()
  OR business_id IN (
    SELECT id FROM businesses 
    WHERE owner_id = auth.uid()
  )
);

-- Tasks RLS 策略
DROP POLICY IF EXISTS "Users can view their assigned tasks" ON tasks;
CREATE POLICY "Users can view their assigned tasks"
ON tasks FOR SELECT
USING (assigned_to = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can create tasks" ON tasks;
CREATE POLICY "Authenticated users can create tasks"
ON tasks FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their tasks" ON tasks;
CREATE POLICY "Users can update their tasks"
ON tasks FOR UPDATE
USING (assigned_to = auth.uid());

-- Business Images RLS 策略
DROP POLICY IF EXISTS "Everyone can view business images" ON business_images;
CREATE POLICY "Everyone can view business images"
ON business_images FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Business owners can manage their images" ON business_images;
CREATE POLICY "Business owners can manage their images"
ON business_images FOR ALL
USING (
  business_id IN (
    SELECT id FROM businesses 
    WHERE owner_id = auth.uid()
  )
);

-- ============================================
-- 12. 插入测试数据（可选）
-- ============================================
-- 取消注释以插入测试数据

/*
-- 插入测试商店
INSERT INTO businesses (name, city, address, phone, description) VALUES
('Studio One', 'San Francisco', '123 Market Street, San Francisco, CA 94102', '(415) 555-0001', 'Professional hair salon with experienced stylists'),
('Studio Two', 'San Jose', '456 Santa Clara Street, San Jose, CA 95113', '(408) 555-0002', 'Modern beauty salon and spa');

-- 插入测试专员
INSERT INTO specialists (name, intro, business_id, availabilities) VALUES
('Specialist One', 'Expert in hair cutting and styling with 10 years of experience', 
  (SELECT id FROM businesses WHERE name = 'Studio One' LIMIT 1), 
  ARRAY[1,2,3,4,5]),
('Specialist Two', 'Professional makeup artist and beauty consultant', 
  (SELECT id FROM businesses WHERE name = 'Studio Two' LIMIT 1), 
  ARRAY[2,3,4,5,6]);

-- 插入测试服务
INSERT INTO services (name, description, price, duration_minutes, business_id) VALUES
('Haircut', 'Professional haircut service', 50.00, 45, 
  (SELECT id FROM businesses WHERE name = 'Studio One' LIMIT 1)),
('Hair Coloring', 'Full hair coloring service', 120.00, 120, 
  (SELECT id FROM businesses WHERE name = 'Studio One' LIMIT 1)),
('Facial Treatment', 'Refreshing facial treatment', 80.00, 60, 
  (SELECT id FROM businesses WHERE name = 'Studio Two' LIMIT 1));
*/

-- ============================================
-- 13. 验证表创建成功
-- ============================================
SELECT 'All tables created successfully!' as status;

-- 列出所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'roles', 'profile_role', 'businesses', 'specialists', 'services', 'appointments', 'tasks', 'business_images')
ORDER BY table_name;

-- 查看 businesses 表结构
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'businesses'
ORDER BY ordinal_position;

-- 查看 specialists 表结构
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'specialists'
ORDER BY ordinal_position;

-- ============================================
-- 完成！接下来的步骤：
-- ============================================
-- 1. 在 Supabase Dashboard → Storage 创建 bucket:
--    - 名称: "images"
--    - 设置为 Public (公开访问)
--    - 文件大小限制: 5MB
--
-- 2. 可选：取消注释上面的测试数据部分，插入示例数据
--
-- 3. 开始使用 Admin 功能！


