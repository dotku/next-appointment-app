# 📊 增量数据库设置指南

## 🎯 适用场景

**这个脚本适用于**：已有 `roles`, `profiles`, `profile_role` 三个表的数据库

## 📦 新建文件

### `database-setup-incremental.sql`
在现有表的基础上添加：
- ✅ 修改 `profiles` 表（添加 avatar_url）
- ✅ 创建 `businesses` 表（带 logo_url, calendly_url）
- ✅ 创建 `specialists` 表（带 avatar_url, phone, calendly_url）
- ✅ 创建 `services` 表
- ✅ 创建 `appointments` 表
- ✅ 创建 `tasks` 表
- ✅ 创建 `business_images` 表（多图片支持）
- ✅ 所有索引和触发器
- ✅ 所有 RLS 安全策略

---

## 🚀 使用步骤

### Step 1: 确认现有表
确保数据库中已有这三个表：
- ✅ `roles`
- ✅ `profiles`
- ✅ `profile_role`

### Step 2: 运行增量脚本

1. 登录 **Supabase Dashboard**
2. 进入 **SQL Editor**
3. 打开 `database-setup-incremental.sql`
4. **复制所有内容**
5. **粘贴到 SQL Editor**
6. 点击 **"Run"** 运行

⏱️ 预计执行时间: 5-10秒

### Step 3: 创建 Storage Bucket

1. 左侧菜单点击 **Storage**
2. 点击 **"Create bucket"**
3. 填写：
   - Name: `images`
   - ✅ 勾选 **"Public bucket"**
4. 点击 **"Create"**

---

## 📊 完成后的数据库结构

### 现有表（保持不变）
- ✅ `roles` - 角色表
- ✅ `profiles` - 用户档案（新增 avatar_url 字段）
- ✅ `profile_role` - 用户角色关联

### 新增表
- ✅ `businesses` - 商店/沙龙
- ✅ `specialists` - 专员
- ✅ `services` - 服务项目
- ✅ `appointments` - 预约
- ✅ `tasks` - 任务
- ✅ `business_images` - 商店图片库

**总计**: 9个表

---

## 🔑 关键字段说明

### profiles 表（已修改）
```sql
-- 新增字段：
avatar_url TEXT  -- 用户头像URL
```

### businesses 表（新建）
```sql
id UUID
owner_id UUID → profiles(id)  -- 商店所有者
name TEXT
city TEXT
address TEXT
description TEXT
phone TEXT
email TEXT
website TEXT
logo_url TEXT              -- 商店Logo
calendly_url TEXT          -- Calendly预约链接
latitude, longitude        -- 地理坐标
```

### specialists 表（新建）
```sql
id UUID
profile_id UUID → profiles(id)
business_id UUID → businesses(id)
name TEXT
intro TEXT
avatar_url TEXT            -- 专员头像
phone TEXT                 -- 联系电话
calendly_url TEXT          -- Calendly链接
availabilities INTEGER[]   -- 可用时间
```

---

## 🔐 RLS 策略说明

### Businesses
- 所有人可以查看所有商店
- 认证用户可以创建商店
- 只有所有者（owner_id = auth.uid()）可以编辑/删除

### Specialists
- 所有人可以查看
- 只有商店所有者可以管理该商店的专员

### Appointments
- 用户可以查看自己的预约
- 商店所有者可以查看自己商店的预约

---

## ✅ 验证步骤

### 1. 检查表是否创建成功
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

应该看到 9 个表。

### 2. 检查 businesses 表结构
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'businesses'
ORDER BY ordinal_position;
```

应该看到 logo_url, calendly_url 等字段。

### 3. 测试插入数据
取消注释脚本底部的测试数据部分，或手动插入：

```sql
INSERT INTO businesses (name, city, phone) 
VALUES ('Test Salon', 'San Francisco', '555-0001');
```

---

## 📝 与其他文件的对比

| 文件 | 适用场景 |
|------|---------|
| `database-setup-complete.sql` | 全新数据库，从零开始 |
| `admin-features-migration.sql` | 已有完整数据库，只添加字段 |
| `database-setup-incremental.sql` | 有 profiles/roles 表，添加其他表 ✅ |

---

## 🧪 测试数据（可选）

如果需要测试数据，在脚本中找到 `插入测试数据` 部分，取消注释后重新运行那一段：

```sql
-- 插入测试商店
INSERT INTO businesses (name, city, address, phone, description) VALUES
('Studio One', 'San Francisco', '123 Market St', '(415) 555-0001', 'Professional salon'),
('Studio Two', 'San Jose', '456 Santa Clara St', '(408) 555-0002', 'Modern beauty salon');

-- 插入测试专员
INSERT INTO specialists (name, intro, business_id, availabilities) VALUES
('Specialist One', 'Expert stylist', 
  (SELECT id FROM businesses WHERE name = 'Studio One' LIMIT 1), 
  ARRAY[1,2,3,4,5]);
```

---

## 🐛 常见问题

### 问题 1: "relation already exists"
**原因**: 表已经创建过
**解决**: 
- 如果是测试环境，可以删除表重新创建
- 如果是生产环境，检查哪些表已存在，跳过那部分

### 问题 2: RLS 策略创建失败
**原因**: 策略名称冲突
**解决**: 脚本中已使用 `DROP POLICY IF EXISTS`，应该不会冲突

### 问题 3: 触发器创建失败
**原因**: `update_updated_at_column` 函数不存在
**解决**: 
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

---

## 🎯 下一步

数据库设置完成后：

1. ✅ 创建 Storage bucket "images"
2. ✅ 测试图片上传功能
   - 访问: http://localhost:3000/test-upload
3. ✅ 开始开发 Admin 功能
   - 参考 `ADMIN_FEATURES_CHECKLIST.md`

---

## 🎉 完成！

你的数据库现在有：
- 用户管理（profiles, roles）
- 商店管理（带Logo和Calendly）
- 专员管理（带头像和电话）
- 预约系统
- 任务管理
- 图片存储支持

可以开始开发了！ 🚀


