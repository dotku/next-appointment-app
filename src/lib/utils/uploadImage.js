import supabase from "@/src/services/supabase";

/**
 * 验证图片文件
 * @param {File} file - 要验证的文件
 * @returns {Object} - { valid: boolean, error: string }
 */
export function validateImageFile(file) {
  // 检查文件是否存在
  if (!file) {
    return { valid: false, error: "请选择文件" };
  }

  // 检查文件类型
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "文件类型不支持，请上传 JPG、PNG、WEBP 或 GIF 格式的图片",
    };
  }

  // 检查文件大小 (5MB = 5 * 1024 * 1024 bytes)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `文件大小超过限制，请上传小于 5MB 的图片（当前: ${(file.size / 1024 / 1024).toFixed(2)}MB）`,
    };
  }

  return { valid: true, error: null };
}

/**
 * 生成唯一的文件名
 * @param {string} originalName - 原始文件名
 * @returns {string} - 唯一的文件名
 */
function generateUniqueFileName(originalName) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop().toLowerCase();
  return `${timestamp}-${randomString}.${extension}`;
}

/**
 * 上传图片到 Supabase Storage
 * @param {File} file - 要上传的文件
 * @param {string} folderPath - 存储路径（例如: 'avatars', 'business-logos'）
 * @param {string} bucket - Storage bucket 名称，默认 'UserAvatars'
 * @returns {Promise<Object>} - { success: boolean, url: string, error: string, path: string }
 */
export async function uploadImage(file, folderPath = "uploads", bucket = "UserAvatars") {
  try {
    // 1. 验证文件
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return {
        success: false,
        url: null,
        error: validation.error,
        path: null,
      };
    }

    // 2. 生成唯一文件名
    const uniqueFileName = generateUniqueFileName(file.name);
    const filePath = `${folderPath}/${uniqueFileName}`;

    // 3. 上传到 Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false, // 不覆盖已存在的文件
      });

    if (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        url: null,
        error: `上传失败: ${error.message}`,
        path: null,
      };
    }

    // 4. 获取公开访问 URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    return {
      success: true,
      url: publicUrl,
      error: null,
      path: filePath, // 保存路径，用于后续删除
    };
  } catch (error) {
    console.error("Upload exception:", error);
    return {
      success: false,
      url: null,
      error: `上传异常: ${error.message}`,
      path: null,
    };
  }
}

/**
 * 从 Supabase Storage 删除图片
 * @param {string} filePath - 文件路径（从 uploadImage 返回的 path）
 * @param {string} bucket - Storage bucket 名称，默认 'UserAvatars'
 * @returns {Promise<Object>} - { success: boolean, error: string }
 */
export async function deleteImage(filePath, bucket = "UserAvatars") {
  try {
    if (!filePath) {
      return {
        success: false,
        error: "文件路径不能为空",
      };
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return {
        success: false,
        error: `删除失败: ${error.message}`,
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Delete exception:", error);
    return {
      success: false,
      error: `删除异常: ${error.message}`,
    };
  }
}

/**
 * 上传头像（用户）
 * 使用 auth.user 的 user_id 作为文件名
 * @param {File} file - 要上传的文件
 * @param {string} userId - auth.users 表的 user ID (UUID)
 * @returns {Promise<Object>}
 */
export async function uploadAvatar(file, userId) {
  const fileExt = file.name.split('.').pop().toLowerCase();
  const fileName = `${userId}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from("UserAvatars")
    .upload(`avatars/${fileName}`, file, {
      cacheControl: "3600",
      upsert: true, // 覆盖已存在的文件（更新头像）
    });

  if (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      url: null,
      error: `上传失败: ${error.message}`,
      path: null,
    };
  }

  const { data: publicUrlData } = supabase.storage
    .from("UserAvatars")
    .getPublicUrl(`avatars/${fileName}`);

  return {
    success: true,
    url: publicUrlData.publicUrl,
    error: null,
    path: `avatars/${fileName}`,
  };
}

/**
 * 上传商店Logo
 * 使用 business_id 作为文件名
 * @param {File} file - 要上传的文件
 * @param {string} businessId - businesses 表的 ID (UUID)
 * @returns {Promise<Object>}
 */
export async function uploadBusinessLogo(file, businessId) {
  const fileExt = file.name.split('.').pop().toLowerCase();
  const fileName = `${businessId}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from("UserAvatars")
    .upload(`store_logo/${fileName}`, file, {
      cacheControl: "3600",
      upsert: true, // 覆盖已存在的文件（更新Logo）
    });

  if (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      url: null,
      error: `上传失败: ${error.message}`,
      path: null,
    };
  }

  const { data: publicUrlData } = supabase.storage
    .from("UserAvatars")
    .getPublicUrl(`store_logo/${fileName}`);

  return {
    success: true,
    url: publicUrlData.publicUrl,
    error: null,
    path: `store_logo/${fileName}`,
  };
}

/**
 * 上传专员头像
 * 使用 specialist_id 作为文件名
 * @param {File} file - 要上传的文件
 * @param {string} specialistId - specialists 表的 ID (UUID)
 * @returns {Promise<Object>}
 */
export async function uploadSpecialistAvatar(file, specialistId) {
  const fileExt = file.name.split('.').pop().toLowerCase();
  const fileName = `${specialistId}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from("UserAvatars")
    .upload(`specialist-avatars/${fileName}`, file, {
      cacheControl: "3600",
      upsert: true, // 覆盖已存在的文件（更新头像）
    });

  if (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      url: null,
      error: `上传失败: ${error.message}`,
      path: null,
    };
  }

  const { data: publicUrlData } = supabase.storage
    .from("UserAvatars")
    .getPublicUrl(`specialist-avatars/${fileName}`);

  return {
    success: true,
    url: publicUrlData.publicUrl,
    error: null,
    path: `specialist-avatars/${fileName}`,
  };
}

