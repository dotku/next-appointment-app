# 需求1总结：搜索 + 预约

## 📊 数据库修改

### 修改的表和字段

#### 1. `businesses` 表（添加1个字段）
```sql
ALTER TABLE businesses ADD COLUMN calendly_url TEXT;
```
**用途**：沙龙级别的 Calendly 预约链接

#### 2. `specialists` 表（添加2个字段）
```sql
ALTER TABLE specialists 
ADD COLUMN phone TEXT,
ADD COLUMN calendly_url TEXT;
```
**用途**：
- `phone`: 专员独立电话（如果没有则用所属沙龙的 phone）
- `calendly_url`: 专员独立的 Calendly 链接

---

## 🔌 需要的 API

### 1. 搜索 API
**路径**: `POST /api/search`

**功能**: 统一搜索沙龙和专员

```typescript
// 请求
{
  query: string,        // 搜索关键词
  type?: 'all' | 'business' | 'specialist'  // 可选的类型筛选
}

// 响应
{
  businesses: Business[],      // 沙龙结果数组
  specialists: Specialist[]   // 专员结果数组
}
```

**实现位置**: `src/app/api/search/route.ts`

**数据库查询**:
```sql
-- 搜索沙龙
SELECT * FROM businesses 
WHERE name ILIKE '%关键词%' 
   OR city ILIKE '%关键词%' 
   OR address ILIKE '%关键词%';

-- 搜索专员
SELECT specialists.*, 
       businesses.name as business_name,
       businesses.city,
       businesses.address,
       businesses.phone as business_phone
FROM specialists
JOIN businesses ON specialists.business_id = businesses.id
WHERE specialists.name ILIKE '%关键词%' 
   OR specialists.intro ILIKE '%关键词%';
```

---

### 2. 获取详情 API（可选，已有数据可直接用）
**路径**: `GET /api/businesses/:id` 和 `GET /api/specialists/:id`

**功能**: 获取单个沙龙/专员的完整信息

**说明**: 
- 如果前端已经有完整数据，可能不需要单独的详情 API
- 用于点击查看详情的场景

---

## 🎨 前端设计

### 页面结构

```
首页 / 或 独立搜索页
├── 🔍 搜索框（统一搜索）
├── 📍 沙龙结果区域
│   └── 沙龙卡片列表
└── 👨‍⚕️ 专员结果区域
    └── 专员卡片列表
```

---

### 核心组件

#### 1. 搜索框组件 `src/components/Search/SearchInput.tsx`

```tsx
// 功能
- 用户输入关键词
- 防抖处理（300ms）
- 调用搜索 API
- 显示加载状态
```

#### 2. 搜索结果组件 `src/components/Search/SearchResults.tsx`

```tsx
// 功能
- 显示沙龙结果列表
- 显示专员结果列表
- 两个区域分组显示
- 统计数量
```

#### 3. 沙龙卡片 `src/components/Business/BusinessCard.tsx`

```tsx
// 显示内容：
- 沙龙名称 (name)
- 位置 (city + address)
- 电话 (phone)
- 预约按钮组（电话 + Calendly）
```

#### 4. 专员卡片 `src/components/Specialist/SpecialistCard.tsx`

```tsx
// 显示内容：
- 专员名称 (name)
- 简介 (intro)
- 所属沙龙 (businesses.name)
- 沙龙位置 (businesses.city)
- 电话（专员自己的或所属沙龙的）
- 预约按钮组（电话 + Calendly）
```

#### 5. 预约按钮 `src/components/Appointment/AppointmentButtons.tsx`

```tsx
// 功能
- 电话预约按钮（tel: 链接）
- Calendly 预约按钮（新窗口打开）
```

---

### 数据流

```
用户输入关键词 "美发"
    ↓
SearchInput 组件防抖 (300ms)
    ↓
调用 POST /api/search
    ↓
后端查询：Supabase
  - SELECT businesses WHERE name/city/address ILIKE
  - SELECT specialists JOIN businesses WHERE name/intro ILIKE
    ↓
返回结果：
  {
    businesses: [...],
    specialists: [...]
  }
    ↓
SearchResults 组件渲染
  - 分组显示
  - 统计数量
    ↓
用户点击某个卡片
    ↓
显示详情 + 预约按钮
    ↓
用户选择预约方式
  - 电话：直接拨打
  - Calendly：跳转链接
```

---

## 📝 实现步骤

### Phase 1: 数据库
1. ✅ 运行 `src/supabase/add_search_fields.sql`
2. ✅ 验证字段已添加

### Phase 2: API
1. ✅ 创建 `src/app/api/search/route.ts`
2. ✅ 实现搜索逻辑（沙龙 + 专员）

### Phase 3: 前端组件
1. ✅ 创建 SearchInput 组件
2. ✅ 创建 SearchResults 组件
3. ✅ 创建 BusinessCard 组件
4. ✅ 创建 SpecialistCard 组件
5. ✅ 创建 AppointmentButtons 组件

### Phase 4: 集成
1. ✅ 创建搜索页面或修改首页
2. ✅ 集成所有组件
3. ✅ 测试搜索和预约功能

---

## 📊 数据流转示意

```
数据库表结构
├── businesses
│   ├── id (uuid)
│   ├── name (已有)
│   ├── city (已有)
│   ├── address (已有)
│   ├── phone (已有)
│   ├── latitude (已有)
│   ├── longitude (已有)
│   └── calendly_url (新增)
│
└── specialists
    ├── id (uuid)
    ├── name (已有)
    ├── intro (已有)
    ├── business_id (已有)
    ├── availabilities (已有)
    ├── phone (新增)
    └── calendly_url (新增)
    
         ↓ 搜索查询

API 响应
├── businesses[]
│   └── 完整沙龙信息
└── specialists[]
    └── 专员信息 + 关联的沙龙信息（JOIN查询）
```

---

## ✅ 检查清单

### 后端
- [ ] 运行 `add_search_fields.sql` 添加字段
- [ ] 创建搜索 API `/api/search`
- [ ] 实现沙龙搜索逻辑
- [ ] 实现专员搜索逻辑（包含关联沙龙）
- [ ] 测试 API 响应

### 前端
- [ ] 创建 SearchInput 组件
- [ ] 创建 SearchResults 组件
- [ ] 创建 BusinessCard 组件
- [ ] 创建 SpecialistCard 组件
- [ ] 创建 AppointmentButtons 组件
- [ ] 集成到搜索页面
- [ ] 测试搜索功能
- [ ] 测试预约按钮（电话 + Calendly）

---

## 🎯 关键要点

1. **最小化修改**：只添加 3 个必要字段
2. **使用现有数据**：name, city, address, intro, phone, lat/lng
3. **双重预约**：电话（tel:） + Calendly（链接）
4. **统一搜索**：一次搜索返回沙龙和专员两种结果
5. **清晰展示**：按类型分组，统计数据量


