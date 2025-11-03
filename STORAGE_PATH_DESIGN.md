# 📂 Storage 路径设计文档

## 🎯 设计原则

使用 **实体 ID 作为文件名**，简洁高效，便于管理。

---

## 📁 存储结构

```
UserAvatars/  (bucket)
├── avatars/
│   ├── {user_id}.jpg
│   ├── {user_id}.png
│   └── ...
│
├── business-logos/
│   ├── {business_id}.jpg
│   ├── {business_id}.png
│   └── ...
│
└── specialist-avatars/
    ├── {specialist_id}.jpg
    ├── {specialist_id}.png
    └── ...
```

---

## 📍 具体路径规则

### 1. 用户头像 - `avatars/`

**函数**: `uploadAvatar(file, userId)`

**路径格式**: `avatars/{userId}.{ext}`

**示例**:
```
avatars/550e8400-e29b-41d4-a716-446655440000.jpg
avatars/123e4567-e89b-12d3-a456-426614174000.png
```

**特点**:
- ✅ 使用 `auth.users` 表的 `id` (UUID)
- ✅ `upsert: true` - 更新头像时自动覆盖旧文件
- ✅ 每个用户只有一个头像文件

---

### 2. 商店Logo - `business-logos/`

**函数**: `uploadBusinessLogo(file, businessId)`

**路径格式**: `business-logos/{businessId}.{ext}`

**示例**:
```
business-logos/abc12345-1234-5678-90ab-cdef12345678.jpg
business-logos/def67890-abcd-ef12-3456-789012345678.png
```

**特点**:
- ✅ 使用 `businesses` 表的 `id` (UUID)
- ✅ `upsert: true` - 更新Logo时自动覆盖
- ✅ 每个商店只有一个Logo

---

### 3. 专员头像 - `specialist-avatars/`

**函数**: `uploadSpecialistAvatar(file, specialistId)`

**路径格式**: `specialist-avatars/{specialistId}.{ext}`

**示例**:
```
specialist-avatars/xyz98765-fedc-ba09-8765-432109876543.jpg
specialist-avatars/mnb54321-0987-6543-210f-edcba9876543.webp
```

**特点**:
- ✅ 使用 `specialists` 表的 `id` (UUID)
- ✅ `upsert: true` - 更新头像时自动覆盖
- ✅ 每个专员只有一个头像

---

## 🔄 文件更新机制

### 覆盖策略 (`upsert: true`)

当上传同名文件时：
1. **自动覆盖**旧文件
2. **无需手动删除**旧文件
3. **URL保持不变**（只需刷新即可看到新图片）

**示例流程**:
```javascript
// 第一次上传
uploadAvatar(file1, 'user-123')
→ avatars/user-123.jpg  (创建)

// 第二次上传（更新头像）
uploadAvatar(file2, 'user-123')
→ avatars/user-123.jpg  (覆盖)
```

---

## 📊 与数据库的关联

### 用户头像
```sql
-- profiles 表
UPDATE profiles 
SET avatar_url = 'https://xxx.supabase.co/storage/v1/object/public/UserAvatars/avatars/{user_id}.jpg'
WHERE id = {user_id};
```

### 商店Logo
```sql
-- businesses 表
UPDATE businesses 
SET logo_url = 'https://xxx.supabase.co/storage/v1/object/public/UserAvatars/business-logos/{business_id}.jpg'
WHERE id = {business_id};
```

### 专员头像
```sql
-- specialists 表
UPDATE specialists 
SET avatar_url = 'https://xxx.supabase.co/storage/v1/object/public/UserAvatars/specialist-avatars/{specialist_id}.jpg'
WHERE id = {specialist_id};
```

---

## 💡 设计优势

### 1. 简洁清晰
- 路径直接对应实体ID
- 无需额外的时间戳或随机字符串
- 易于理解和维护

### 2. 便于管理
```javascript
// 知道用户ID就能知道头像路径
const avatarUrl = `https://xxx.supabase.co/storage/v1/object/public/UserAvatars/avatars/${userId}.jpg`;

// 删除用户时，同时删除头像
await deleteImage(`avatars/${userId}.jpg`);
```

### 3. 自动更新
- `upsert: true` 确保更新时自动覆盖
- 不会产生冗余文件
- 节省存储空间

### 4. 性能优化
- 按文件夹分类，便于批量操作
- URL固定，利于CDN缓存
- 查询简单，无需复杂匹配

---

## 🔍 查找和访问

### 获取用户头像
```javascript
// 方式1: 从数据库读取
const { data } = await supabase
  .from('profiles')
  .select('avatar_url')
  .eq('id', userId)
  .single();

// 方式2: 直接构建URL（如果知道有头像）
const avatarUrl = supabase.storage
  .from('UserAvatars')
  .getPublicUrl(`avatars/${userId}.jpg`).data.publicUrl;
```

### 检查文件是否存在
```javascript
const { data, error } = await supabase.storage
  .from('UserAvatars')
  .list('avatars', {
    search: `${userId}`
  });

const hasAvatar = data && data.length > 0;
```

---

## 🗑️ 删除文件

### 删除用户头像
```javascript
import { deleteImage } from '@/src/lib/utils/uploadImage';

// 假设知道扩展名
await deleteImage(`avatars/${userId}.jpg`);

// 或者删除所有该用户的头像（如果不确定扩展名）
const { data } = await supabase.storage
  .from('UserAvatars')
  .list('avatars', { search: userId });

for (const file of data) {
  await deleteImage(`avatars/${file.name}`);
}
```

---

## 📝 使用示例

### 完整流程：用户上传头像

```javascript
import { uploadAvatar } from '@/src/lib/utils/uploadImage';
import supabase from '@/src/services/supabase';

async function handleAvatarUpload(file, userId) {
  // 1. 上传图片
  const result = await uploadAvatar(file, userId);
  
  if (!result.success) {
    console.error('上传失败:', result.error);
    return;
  }
  
  // 2. 更新数据库
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: result.url })
    .eq('id', userId);
  
  if (error) {
    console.error('数据库更新失败:', error);
    return;
  }
  
  console.log('头像上传并保存成功！', result.url);
}
```

### 完整流程：商店上传Logo

```javascript
import { uploadBusinessLogo } from '@/src/lib/utils/uploadImage';

async function handleLogoUpload(file, businessId) {
  // 1. 上传图片
  const result = await uploadBusinessLogo(file, businessId);
  
  if (!result.success) {
    console.error('上传失败:', result.error);
    return;
  }
  
  // 2. 更新数据库
  const { error } = await supabase
    .from('businesses')
    .update({ logo_url: result.url })
    .eq('id', businessId);
  
  if (error) {
    console.error('数据库更新失败:', error);
    return;
  }
  
  console.log('Logo上传并保存成功！', result.url);
}
```

---

## ⚠️ 注意事项

### 1. 文件扩展名
- 保留原始文件的扩展名
- 支持 `.jpg`, `.png`, `.webp`, `.gif`
- 同一用户可以更换不同格式的图片

### 2. 缓存问题
- URL不变，可能有缓存
- 解决方案：在URL后添加时间戳参数
```javascript
const avatarUrl = `${result.url}?t=${Date.now()}`;
```

### 3. 删除实体时
记得同时删除关联的图片：
```javascript
// 删除用户时
await deleteImage(`avatars/${userId}.jpg`);

// 删除商店时
await deleteImage(`business-logos/${businessId}.jpg`);

// 删除专员时
await deleteImage(`specialist-avatars/${specialistId}.jpg`);
```

---

## ✅ 总结

| 实体 | 路径格式 | 函数 | 覆盖策略 |
|------|---------|------|---------|
| 用户头像 | `avatars/{userId}.{ext}` | `uploadAvatar()` | ✅ 覆盖 |
| 商店Logo | `business-logos/{businessId}.{ext}` | `uploadBusinessLogo()` | ✅ 覆盖 |
| 专员头像 | `specialist-avatars/{specialistId}.{ext}` | `uploadSpecialistAvatar()` | ✅ 覆盖 |

**核心原则**：一个实体 → 一个文件 → 使用实体ID作为文件名

