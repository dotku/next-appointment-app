# 需求1：搜索沙龙和专员

## 📊 数据库修改

### 无需修改现有表结构！

**说明**：搜索功能只需要现有字段，不添加新字段。
- 搜索沙龙：使用 name, city, address
- 搜索专员：使用 name, intro

### 如需优化搜索性能（可选）

```sql
-- 创建搜索索引（提升性能，可选）
CREATE INDEX IF NOT EXISTS idx_businesses_name_search 
  ON businesses USING gin(to_tsvector('simple', name));

CREATE INDEX IF NOT EXISTS idx_specialists_name_search 
  ON specialists USING gin(to_tsvector('simple', name));
```

---

## 🔌 需要的 API

### 1 个搜索 API

**路径**: `POST /api/search`

```typescript
// 请求
{
  query: string,              // 搜索关键词
  type?: 'all' | 'business' | 'specialist'  // 类型筛选（可选）
}

// 响应
{
  businesses: Array<{
    id, name, city, address, phone, latitude, longitude
  }>,
  specialists: Array<{
    id, name, intro, business_id, availabilities,
    // 如果需要显示所属沙龙信息，可以 JOIN 查询
  }>
}
```

---

## 🎨 前端设计

### 核心功能：统一搜索框

```
用户输入关键词
    ↓
搜索两个表（沙龙 + 专员）
    ↓
按类型分组显示结果
```

### 需要的组件（3个）

#### 1. SearchInput 组件
```tsx
// src/components/Search/SearchInput.tsx
- 输入框
- 防抖处理（300ms）
- 调用搜索 API
```

#### 2. SearchResults 组件
```tsx
// src/components/Search/SearchResults.tsx
- 显示 "沙龙 (3)" 标题
- 显示 "专员 (5)" 标题
- 分组展示结果
```

#### 3. ResultCard 组件（或分开两个卡片）
```tsx
// src/components/Business/BusinessCard.tsx
显示：name, city, address

// src/components/Specialist/SpecialistCard.tsx
显示：name, intro, 所属沙龙名称
```

---

## 📋 实现步骤

### Phase 1: API
1. 创建 `src/app/api/search/route.ts`
2. 实现 Supabase 查询
   - 搜索 businesses：name, city, address
   - 搜索 specialists：name, intro
3. 返回结果

### Phase 2: 前端组件
1. 创建 SearchInput 组件
2. 创建 SearchResults 组件
3. 创建 BusinessCard 组件
4. 创建 SpecialistCard 组件

### Phase 3: 集成
1. 替换现有的 SearchInput（或新建页面）
2. 集成 SearchResults
3. 测试搜索功能

---

## 🔍 搜索逻辑

```typescript
// 搜索沙龙
const searchBusinesses = async (query: string) => {
  const { data } = await supabase
    .from('businesses')
    .select('*')
    .or(`name.ilike.%${query}%, city.ilike.%${query}%, address.ilike.%${query}%`);
  
  return data || [];
};

// 搜索专员
const searchSpecialists = async (query: string) => {
  // 如果需要显示所属沙龙信息
  const { data } = await supabase
    .from('specialists')
    .select(`
      *,
      businesses:business_id (name, city)
    `)
    .or(`name.ilike.%${query}%, intro.ilike.%${query}%`);
  
  return data || [];
};

// 统一搜索
const unifiedSearch = async (query: string) => {
  const [businesses, specialists] = await Promise.all([
    searchBusinesses(query),
    searchSpecialists(query)
  ]);
  
  return { businesses, specialists };
};
```

---

## ✅ 检查清单

### API
- [ ] 创建 `/api/search` API
- [ ] 实现沙龙搜索
- [ ] 实现专员搜索
- [ ] 测试 API

### 前端
- [ ] 创建 SearchInput
- [ ] 创建 SearchResults
- [ ] 创建 BusinessCard
- [ ] 创建 SpecialistCard
- [ ] 集成到页面
- [ ] 测试搜索功能

---

## 🎯 关键点

1. **无需修改数据库**：使用现有字段即可
2. **一次搜索两个表**：沙龙 + 专员
3. **分组显示**：按类型展示结果
4. **不涉及预约**：仅搜索和展示
5. **简单实现**：使用 LIKE/ILIKE 查询


