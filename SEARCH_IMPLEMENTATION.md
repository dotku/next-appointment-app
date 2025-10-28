# 搜索功能实现 - 精简版

## 数据库修改

只添加必需字段：
```sql
-- businesses 表已有：id, name, city, address, phone, latitude, longitude
-- 只需添加：calendly_url

-- specialists 表已有：id, name, intro, user_id, business_id, availabilities
-- 只需添加：phone, calendly_url
```

执行：运行 `src/supabase/add_search_fields.sql`

---

## 搜索实现

### 使用现有字段
- **Businesses**: name, city, address
- **Specialists**: name, intro

### 搜索逻辑

```typescript
// 1. 搜索沙龙
async function searchBusinesses(query: string) {
  const { data } = await supabase
    .from('businesses')
    .select('*')
    .or(`name.ilike.%${query}%, city.ilike.%${query}%, address.ilike.%${query}%`);
  return data;
}

// 2. 搜索专员
async function searchSpecialists(query: string) {
  const { data } = await supabase
    .from('specialists')
    .select(`
      *,
      businesses:business_id (name, city, address, phone, latitude, longitude)
    `)
    .or(`name.ilike.%${query}%, intro.ilike.%${query}%`);
  return data;
}

// 3. 统一搜索
async function unifiedSearch(query: string) {
  const [businesses, specialists] = await Promise.all([
    searchBusinesses(query),
    searchSpecialists(query)
  ]);
  
  return { businesses, specialists };
}
```

---

## UI 展示

### 搜索结果格式

```tsx
interface SearchResult {
  type: 'business' | 'specialist';
  data: any;
}

// 沙龙结果卡片
function BusinessCard({ business }) {
  return (
    <Card>
      <h3>{business.name}</h3>
      <p>{business.city} - {business.address}</p>
      <p>📞 {business.phone}</p>
      <AppointmentButtons 
        phone={business.phone} 
        calendly={business.calendly_url} 
      />
    </Card>
  );
}

// 专员结果卡片
function SpecialistCard({ specialist }) {
  return (
    <Card>
      <h3>{specialist.name}</h3>
      <p>{specialist.intro}</p>
      <p>📍 {specialist.businesses.name}, {specialist.businesses.city}</p>
      <p>📞 {specialist.phone || specialist.businesses.phone}</p>
      <AppointmentButtons 
        phone={specialist.phone || specialist.businesses.phone}
        calendly={specialist.calendly_url || specialist.businesses.calendly_url}
      />
    </Card>
  );
}
```

---

## 预约功能

### 两个按钮

```tsx
function AppointmentButtons({ phone, calendly }) {
  return (
    <div className="appointment-buttons">
      {/* 电话预约 */}
      {phone && (
        <a href={`tel:${phone}`} className="btn-phone">
          📞 {phone}
        </a>
      )}
      
      {/* Calendly 预约 */}
      {calendly && (
        <a href={calendly} target="_blank" className="btn-calendly">
          📅 在线预约
        </a>
      )}
    </div>
  );
}
```

---

## 实现步骤

1. 运行 SQL 添加字段
2. 创建搜索 API (可选，也可以前端直接调用 Supabase)
3. 创建搜索组件
4. 创建结果展示组件
5. 创建预约按钮组件

是否需要我开始实现？


