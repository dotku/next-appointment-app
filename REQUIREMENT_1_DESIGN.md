# 需求 1：搜索服务方/个人 - 设计文档

## 1. 数据库扩展

### 需要添加到 Businesses 表的字段：

```sql
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS 
  description TEXT,                    -- 沙龙描述
  phone TEXT,                          -- 电话号码（已有）
  avatar_url TEXT,                     -- 头像URL
  tags TEXT[],                         -- 服务标签 ['美发', '美容', '美甲']
  rating DECIMAL(3,2),                 -- 评分
  review_count INTEGER,                -- 评论数
  business_hours JSONB,               -- 营业时间
  calendly_url TEXT;                   -- Calendly 预约链接（已有或需要添加）
```

### 需要添加到 Specialists 表的字段：

```sql
ALTER TABLE specialists ADD COLUMN IF NOT EXISTS
  phone TEXT,                          -- 联系电话
  avatar_url TEXT,                     -- 头像
  calendly_url TEXT,                   -- Calendly 链接
  rating DECIMAL(3,2),                 -- 评分
  review_count INTEGER,                -- 评论数
  tags TEXT[],                         -- 专长标签 ['剪发', '染发', '造型']
  address TEXT,                         -- 个人地址（如果是独立服务者）
  latitude DECIMAL(10, 8),            -- 纬度
  longitude DECIMAL(11, 8);           -- 经度
```

---

## 2. 搜索功能设计

### 2.1 搜索接口设计

```typescript
// 统一搜索结果类型
interface SearchResult {
  id: string;
  type: 'business' | 'specialist';
  name: string;
  description?: string;
  avatar?: string;
  tags: string[];
  location: {
    city?: string;
    address?: string;
    lat?: number;
    lng?: number;
  };
  contact: {
    phone?: string;
    calendly_url?: string;
  };
  rating?: number;
  rating_count?: number;
  metadata?: any; // 额外信息
}

// 搜索 API
// src/app/api/search/route.ts
export async function POST(request: Request) {
  const { query, type, location, limit = 20 } = await request.json();
  
  // type: 'all' | 'business' | 'specialist'
  // query: 搜索关键词
  // location: { city, lat, lng } - 可选位置筛选
  
  // 实现逻辑
  const results = await searchBusinessesAndSpecialists(query, type, location);
  return Response.json({ results });
}
```

### 2.2 搜索算法

**选项 A：简单全文搜索（推荐用于 MVP）**

```typescript
async function searchBusinesses(query: string) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .or(`name.ilike.%${query}%, description.ilike.%${query}%, city.ilike.%${query}%`);
  
  return data;
}

async function searchSpecialists(query: string) {
  const { data, error } = await supabase
    .from('specialists')
    .select(`
      *,
      businesses:business_id (
        id, name, city, address, phone
      )
    `)
    .or(`name.ilike.%${query}%, intro.ilike.%${query}%`);
  
  return data;
}

async function searchAll(query: string, type: 'all' | 'business' | 'specialist') {
  const results = [];
  
  if (type === 'all' || type === 'business') {
    const businesses = await searchBusinesses(query);
    results.push(...businesses.map(b => ({
      ...b,
      searchType: 'business'
    })));
  }
  
  if (type === 'all' || type === 'specialist') {
    const specialists = await searchSpecialists(query);
    results.push(...specialists.map(s => ({
      ...s,
      searchType: 'specialist'
    })));
  }
  
  return results;
}
```

**选项 B：使用 PostgreSQL 全文搜索（更强大，但需要更多配置）**

需要创建全文搜索索引：

```sql
-- 为 businesses 创建全文搜索
ALTER TABLE businesses 
ADD COLUMN search_vector tsvector;

CREATE INDEX businesses_search_idx ON businesses USING gin(search_vector);

-- 更新 search_vector 的触发器
CREATE OR REPLACE FUNCTION businesses_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('simple', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE(NEW.city, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER businesses_search_update_trigger
BEFORE INSERT OR UPDATE ON businesses
FOR EACH ROW EXECUTE FUNCTION businesses_search_update();

-- 同样为 specialists 创建
```

---

## 3. UI 组件设计

### 3.1 搜索框组件

```tsx
// src/components/Search/UnifiedSearch.tsx

import { useState, useCallback, useEffect } from 'react';
import { Input } from '@nextui-org/react';

interface SearchResult {
  type: 'business' | 'specialist';
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  location?: string;
}

export default function UnifiedSearch({ onSearch }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 防抖搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        performSearch(query);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      setResults(data.results);
      onSearch?.(data.results);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="搜索沙龙或专员..."
      startContent={<SearchIcon />}
    />
  );
}
```

### 3.2 搜索结果展示组件

```tsx
// src/components/Search/SearchResults.tsx

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
}

export default function SearchResults({ results, onSelect }: SearchResultsProps) {
  // 按类型分组
  const businesses = results.filter(r => r.type === 'business');
  const specialists = results.filter(r => r.type === 'specialist');
  
  return (
    <div className="search-results">
      {/* 沙龙结果 */}
      {businesses.length > 0 && (
        <div className="business-results">
          <h3>📍 沙龙 ({businesses.length})</h3>
          {businesses.map(business => (
            <BusinessCard 
              key={business.id}
              business={business}
              onClick={() => onSelect(business)}
            />
          ))}
        </div>
      )}
      
      {/* 专员结果 */}
      {specialists.length > 0 && (
        <div className="specialist-results">
          <h3>👨‍⚕️ 专员 ({specialists.length})</h3>
          {specialists.map(specialist => (
            <SpecialistCard 
              key={specialist.id}
              specialist={specialist}
              onClick={() => onSelect(specialist)}
            />
          ))}
        </div>
      )}
      
      {results.length === 0 && (
        <div className="no-results">暂无结果</div>
      )}
    </div>
  );
}
```

### 3.3 搜索页面

```tsx
// src/app/search/page.tsx

'use client';

import { useState } from 'react';
import UnifiedSearch from '@/components/Search/UnifiedSearch';
import SearchResults from '@/components/Search/SearchResults';

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  
  return (
    <div className="search-page">
      <UnifiedSearch onSearch={setSearchResults} />
      <SearchResults 
        results={searchResults}
        onSelect={setSelectedResult}
      />
    </div>
  );
}
```

---

## 4. 实现优先级

### Phase 1: MVP（1-2天）
1. ✅ 添加必要字段到数据库（phone, avatar_url, tags, calendly_url）
2. ✅ 实现简单全文搜索（选项A）
3. ✅ 创建统一搜索组件
4. ✅ 创建搜索结果页面
5. ✅ 基本卡片展示

### Phase 2: 增强（2-3天）
1. ✅ 添加评分和评论数
2. ✅ 添加营业时间
3. ✅ 添加位置筛选（按城市）
4. ✅ 添加标签筛选

### Phase 3: 优化（可选）
1. ✅ 实现 PostgreSQL 全文搜索（选项B）
2. ✅ 添加搜索历史
3. ✅ 添加热门搜索
4. ✅ 添加智能推荐

---

## 5. 关键实现细节

### 5.1 搜索关键词匹配
- 支持中文搜索
- 支持拼音搜索（需要额外配置）
- 支持标签搜索

### 5.2 结果排序
```typescript
// 排序策略
1. 关键词完全匹配（名称）
2. 关键词部分匹配（名称）
3. 描述中包含关键词
4. 标签匹配
5. 按评分和评论数
```

### 5.3 性能优化
- 使用防抖减少请求
- 搜索结果缓存
- 分页加载
- 异步加载图片

---

## 6. 测试数据

建议添加一些测试数据：

```sql
INSERT INTO businesses (name, city, address, phone, description, tags, latitude, longitude) VALUES
('美丽沙龙', '上海', '上海市徐汇区xxx路123号', '188-0000-0001', '专业美发沙龙', '{美发,造型,染发}', 31.2304, 121.4737),
('时尚美容馆', '北京', '北京市朝阳区xxx街456号', '188-0000-0002', '高端美容护肤', '{美容,护肤,美甲}', 39.9042, 116.4074);

INSERT INTO specialists (name, intro, business_id, tags, phone, user_id) VALUES
('张美发师', '10年美发经验，擅长剪发造型', 1, '{剪发,造型}', '188-0000-0011', 1),
('李美容师', '5年美容经验，专业护肤', 2, '{护肤,美容}', '188-0000-0012', 2);
```

---

## 下一步行动

1. 修改数据库结构（运行 ALTER TABLE 语句）
2. 创建搜索 API 路由
3. 创建搜索组件
4. 集成到首页或独立的搜索页面
5. 添加测试数据


