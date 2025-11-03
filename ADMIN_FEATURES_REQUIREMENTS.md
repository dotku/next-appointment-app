# Admin 功能需求分析

## 📋 当前状态

### 现有 Admin 功能
```
✅ TasksManager - 管理任务
✅ AppointmentsManager - 管理预约  
✅ Customers Manager - 管理客户（创建用户）
✅ Specialists Manager - 管理专员
✅ Services Manager - 管理服务
✅ Businesses Manager - 基础版（只有名字和地点）
```

### 问题
1. **BusinessesManager 太简单**
   - 只能输入商店名字和地点
   - 没有保存到真实数据库（mock数据）
   - 没有关联创建者（owner_id）
   - 缺少很多必要字段

2. **没有图片上传功能**
   - 用户无法上传头像
   - 商店无法上传Logo
   - 专员无法上传头像

3. **没有 Calendly 链接功能**
   - 无法添加在线预约链接

---

## 🎯 新需求

老板要求添加以下功能：

### 1. 管理图标/头像 (Manage Icons)
用户能够上传和管理图片：
- **用户头像** (Profile Avatar)
- **商店Logo** (Business Logo)  
- **专员头像** (Specialist Avatar)

### 2. 添加 Calendly 链接
为将来迁移到 Calendly 预约系统做准备：
- 商店可以设置 Calendly 链接
- 专员可以设置 Calendly 链接

### 3. 完整的商店创建功能
用户能够完整地创建和管理自己的商店。

---

## 🏗️ 要实现的功能模块

### 模块 1: 完善 BusinessesManager 组件

#### 当前状态
```jsx
// 现在只有这些
<input name="businessName" />
<input name="businessLocation" />
<button>Create</button>
```

#### 需要变成
```jsx
// 完整的商店创建表单
<form>
  {/* 基本信息 */}
  <input name="name" placeholder="商店名称" required />
  <input name="city" placeholder="城市" required />
  <input name="address" placeholder="详细地址" />
  <textarea name="description" placeholder="商店介绍" />
  <input name="phone" placeholder="联系电话" />
  <input name="email" placeholder="邮箱" />
  <input name="website" placeholder="网站" />
  
  {/* Logo上传 */}
  <FileUpload 
    label="上传商店Logo"
    accept="image/*"
    onUpload={handleLogoUpload}
  />
  <ImagePreview url={logoUrl} />
  
  {/* Calendly链接 */}
  <input 
    name="calendly_url" 
    placeholder="https://calendly.com/your-link"
  />
  
  <button type="submit">创建商店</button>
</form>
```

#### 功能点
1. ✅ 完整表单验证
2. ✅ 绑定 owner_id 到当前登录用户
3. ✅ 保存到真实 Supabase 数据库
4. ✅ 上传Logo到 Supabase Storage
5. ✅ 表单成功后显示创建的商店列表
6. ✅ 编辑和删除商店功能

---

### 模块 2: 图片上传功能

#### 需要创建的组件

**ImageUploader 组件** (`src/components/Common/ImageUploader.jsx`)
```jsx
功能：
- 文件选择（点击上传或拖拽）
- 图片预览
- 上传进度显示
- 文件大小验证（最大5MB）
- 文件类型验证（jpg, png, webp）
- 上传到 Supabase Storage
- 返回图片URL
```

**使用场景：**
```jsx
// 1. 在 BusinessesManager 使用
<ImageUploader 
  bucketPath="business-logos"
  onUploadSuccess={(url) => setLogoUrl(url)}
/>

// 2. 在 Account 页面使用（用户头像）
<ImageUploader 
  bucketPath="avatars"
  currentImage={user.avatar_url}
  onUploadSuccess={handleAvatarUpdate}
/>

// 3. 在 Specialist 管理使用
<ImageUploader 
  bucketPath="specialist-avatars"
  onUploadSuccess={(url) => setSpecialistAvatar(url)}
/>
```

---

### 模块 3: Calendly 链接输入

#### CalendlyInput 组件 (`src/components/Common/CalendlyInput.jsx`)

```jsx
功能：
- URL 输入框
- 验证 Calendly URL 格式
- 显示预览（可选）
- 测试链接按钮

使用：
<CalendlyInput 
  value={calendlyUrl}
  onChange={setCalendlyUrl}
  label="Calendly 预约链接"
/>
```

---

### 模块 4: 用户头像管理

#### 在 Account 页面添加
```jsx
// src/app/account/page.jsx 或 src/components/Account/Account.tsx

<div className="avatar-section">
  <Avatar src={user.avatar_url} size="large" />
  <ImageUploader 
    bucketPath="avatars"
    currentImage={user.avatar_url}
    onUploadSuccess={updateUserAvatar}
  />
</div>
```

---

### 模块 5: 专员头像和链接管理

#### 完善 Specialist 管理
```jsx
// 在创建/编辑 Specialist 时添加
<ImageUploader label="专员头像" />
<input name="phone" placeholder="联系电话" />
<CalendlyInput label="Calendly 链接" />
```

---

## 📦 需要创建的文件

### 新建组件
```
src/components/
  ├── Common/
  │   ├── ImageUploader.jsx        (图片上传组件)
  │   ├── ImagePreview.jsx         (图片预览组件)
  │   └── CalendlyInput.jsx        (Calendly输入组件)
  │
  └── Admin/
      └── BusinessForm.jsx          (完整的商店表单组件)
```

### 新建工具函数
```
src/lib/
  └── utils/
      ├── uploadImage.js            (Supabase Storage 上传)
      ├── validateUrl.js            (URL验证)
      └── imageHelpers.js           (图片处理工具)
```

### 需要修改的文件
```
src/components/Admin/
  ├── BusinessesManager.jsx         (重构，使用新的 BusinessForm)
  └── Admin.jsx                     (可能需要调整布局)

src/lib/features/businesses/
  ├── businessesAPI.ts              (实现真实的 CRUD 操作)
  └── businessesSlice.ts            (添加新字段支持)

src/components/Account/
  └── Account.tsx                   (添加头像上传)
```

---

## 🔄 完整用户流程

### 流程 1: 创建商店
```
1. 用户登录
2. 进入 Admin 页面
3. 找到 "创建商店" 区域
4. 填写商店信息：
   - 名称、城市、地址
   - 描述、电话、邮箱
5. 上传商店Logo：
   - 点击上传按钮
   - 选择图片文件
   - 看到上传进度
   - 看到图片预览
6. 输入 Calendly 链接（可选）
7. 点击"创建商店"按钮
8. 保存到数据库：
   - 所有文本信息
   - Logo URL
   - Calendly URL
   - owner_id (当前用户)
9. 显示成功消息
10. 在列表中看到新创建的商店
```

### 流程 2: 上传用户头像
```
1. 进入 Account 页面
2. 看到当前头像（或默认头像）
3. 点击"上传头像"
4. 选择图片
5. 预览并确认
6. 上传到 Storage
7. 更新 profiles 表的 avatar_url
8. 头像立即显示
```

### 流程 3: 为商店添加 Calendly 链接
```
1. 在商店列表找到自己的商店
2. 点击"编辑"
3. 找到 Calendly URL 输入框
4. 输入链接（例如: https://calendly.com/my-salon）
5. 验证URL格式
6. 保存
7. 客户在预约时会看到这个链接
```

---

## 🎨 UI/UX 设计建议

### BusinessesManager 布局
```
┌─────────────────────────────────────────┐
│  创建商店                                │
├─────────────────────────────────────────┤
│                                         │
│  基本信息                                │
│  ┌────────────────────────────────┐    │
│  │ 商店名称: [_______________]    │    │
│  │ 城市:     [_______________]    │    │
│  │ 地址:     [_______________]    │    │
│  │ 描述:     [_______________]    │    │
│  │           [_______________]    │    │
│  │ 电话:     [_______________]    │    │
│  │ 邮箱:     [_______________]    │    │
│  └────────────────────────────────┘    │
│                                         │
│  商店Logo                                │
│  ┌────────┐                             │
│  │        │  [上传Logo]                 │
│  │  预览  │  支持: JPG, PNG, WEBP       │
│  │        │  最大: 5MB                  │
│  └────────┘                             │
│                                         │
│  在线预约                                │
│  ┌────────────────────────────────┐    │
│  │ Calendly URL:                  │    │
│  │ [_________________________]    │    │
│  │ 例如: https://calendly.com/... │    │
│  └────────────────────────────────┘    │
│                                         │
│       [取消]  [创建商店]                 │
└─────────────────────────────────────────┘

下方显示：我的商店列表
┌────────────────────────────────────────┐
│ 🏪 Studio One                          │
│ 📍 San Francisco                       │
│ [编辑] [删除]                          │
└────────────────────────────────────────┘
```

---

## 🔧 技术实现要点

### 1. Supabase Storage 上传
```javascript
async function uploadToStorage(file, path) {
  const { data, error } = await supabase.storage
    .from('images')
    .upload(path, file);
  
  if (error) throw error;
  
  return supabase.storage
    .from('images')
    .getPublicUrl(path).data.publicUrl;
}
```

### 2. 保存商店到数据库
```javascript
async function createBusiness(businessData, userId) {
  // 1. 获取用户的 profile_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  // 2. 创建商店
  const { data, error } = await supabase
    .from('businesses')
    .insert({
      ...businessData,
      owner_id: profile.id
    })
    .select()
    .single();
  
  return data;
}
```

### 3. 表单验证
```javascript
function validateBusinessForm(data) {
  const errors = {};
  
  if (!data.name) errors.name = '商店名称必填';
  if (!data.city) errors.city = '城市必填';
  if (data.email && !isValidEmail(data.email)) {
    errors.email = '邮箱格式不正确';
  }
  if (data.calendly_url && !isValidCalendlyUrl(data.calendly_url)) {
    errors.calendly_url = 'Calendly链接格式不正确';
  }
  
  return errors;
}
```

---

## ✅ 实现优先级

### Phase 1: 核心功能（必须）
1. ✅ 创建 ImageUploader 组件
2. ✅ 完善 BusinessesManager
3. ✅ 实现真实的数据库 CRUD
4. ✅ 添加 Calendly URL 输入

### Phase 2: 增强功能（重要）
1. ✅ 用户头像上传（Account页面）
2. ✅ 专员头像和信息完善
3. ✅ 商店编辑和删除功能
4. ✅ 表单验证和错误提示

### Phase 3: 优化（可选）
1. ✅ 图片裁剪功能
2. ✅ 多图片支持（商店相册）
3. ✅ 拖拽上传
4. ✅ 上传进度条
5. ✅ 图片压缩

---

## 📝 注意事项

1. **权限控制**
   - 用户只能创建/编辑/删除自己的商店
   - RLS 策略必须配置正确

2. **图片存储**
   - 需要在 Supabase 创建 Storage Bucket
   - 设置为 Public 访问
   - 配置文件大小和类型限制

3. **用户体验**
   - 表单验证要友好
   - 上传要有进度提示
   - 错误信息要清晰
   - 成功后有明确反馈

4. **数据完整性**
   - owner_id 必须正确关联
   - 图片URL要保存到数据库
   - 删除商店时要清理图片（可选）

---

## 🚀 下一步

1. **让老板运行 SQL 脚本** (`admin-features-migration.sql`)
2. **在 Supabase 创建 Storage Bucket**
3. **开始编码实现功能**

需要我开始写代码吗？从哪个模块开始？


