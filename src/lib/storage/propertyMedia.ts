import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import { MEDIA_CONFIG } from './constants';

export { MEDIA_CONFIG };

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface UploadMediaResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Validates file MIME type, size, and extension before upload.
 */
export function validateMediaFile(file: {
  type: string;
  size: number;
  name: string;
}): FileValidationResult {
  if (file.size > MEDIA_CONFIG.MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  if (!MEDIA_CONFIG.ALLOWED_MIME_TYPES.includes(file.type as any)) {
    return {
      valid: false,
      error: `Unsupported image format (${file.type}). Only JPEG, PNG, and WebP are permitted.`,
    };
  }

  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!MEDIA_CONFIG.ALLOWED_EXTENSIONS.includes(extension as any)) {
    return {
      valid: false,
      error: `Invalid file extension (${extension}). Permitted: .jpg, .jpeg, .png, .webp.`,
    };
  }

  return { valid: true };
}

/**
 * Generates a collision-resistant, sanitized storage key path.
 * Format: properties/{propertyId}/{uuid}-{sanitizedName}.{ext}
 */
export function generateCollisionResistantKey(
  propertyId: string,
  originalFilename: string
): string {
  const extension = '.' + originalFilename.split('.').pop()?.toLowerCase();
  const rawBase = originalFilename.substring(0, originalFilename.lastIndexOf('.')) || 'image';

  // Sanitize filename: remove unsafe chars, keep alphanumeric and hyphens
  const sanitized = rawBase
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 30);

  const uniqueId = crypto.randomUUID().split('-')[0];
  const cleanPropertyId = propertyId.replace(/[^a-zA-Z0-9_-]/g, '');

  return `properties/${cleanPropertyId}/${uniqueId}-${sanitized}${extension}`;
}

/**
 * Uploads a validated image file to the configured storage bucket.
 * Requires authenticated Supabase client with admin role.
 */
export async function uploadPropertyMedia(
  fileBuffer: Buffer | Blob,
  path: string,
  mimeType: string
): Promise<UploadMediaResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    return {
      success: false,
      error: 'Supabase Storage is not yet configured with production credentials.',
    };
  }

  try {
    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from(MEDIA_CONFIG.BUCKET_NAME)
      .upload(path, fileBuffer, {
        contentType: mimeType,
        cacheControl: '31536000', // 1 year immutable cache
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(MEDIA_CONFIG.BUCKET_NAME).getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'An unexpected error occurred during image upload.',
    };
  }
}

/**
 * Deletes an image from storage by key path.
 */
export async function deletePropertyMedia(path: string): Promise<{ success: boolean; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    return {
      success: false,
      error: 'Supabase Storage is not yet configured with production credentials.',
    };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.storage.from(MEDIA_CONFIG.BUCKET_NAME).remove([path]);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete property media.' };
  }
}

/**
 * Resolves a storage path or URL to a safe public image URL.
 */
export function resolvePublicImageUrl(pathOrUrl: string | null | undefined): string {
  if (!pathOrUrl) return MEDIA_CONFIG.FALLBACK_PLACEHOLDER;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') || pathOrUrl.startsWith('/')) {
    return pathOrUrl;
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
    return `${supabaseUrl}/storage/v1/object/public/${MEDIA_CONFIG.BUCKET_NAME}/${pathOrUrl}`;
  }
  return MEDIA_CONFIG.FALLBACK_PLACEHOLDER;
}
