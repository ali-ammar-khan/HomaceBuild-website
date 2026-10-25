'use server';

import { createClient } from '@/lib/supabase/server';
import {
  validateMediaFile,
  generateCollisionResistantKey,
  uploadPropertyMedia,
  deletePropertyMedia,
  MEDIA_CONFIG,
} from '@/lib/storage/propertyMedia';

export interface MediaActionResponse {
  success: boolean;
  message: string;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Server action to upload an authenticated property photograph.
 * Strictly verifies admin role check before storage write.
 */
export async function uploadPropertyImageAction(
  formData: FormData
): Promise<MediaActionResponse> {
  const file = formData.get('file') as File | null;
  const propertyId = (formData.get('property_id') as string) || 'temp';

  if (!file || !(file instanceof File)) {
    return {
      success: false,
      message: 'No valid image file provided.',
      error: 'FILE_MISSING',
    };
  }

  // 1. Validate file format and size
  const validation = validateMediaFile({
    type: file.type,
    size: file.size,
    name: file.name,
  });

  if (!validation.valid) {
    return {
      success: false,
      message: validation.error || 'Invalid file format or size.',
      error: 'VALIDATION_FAILED',
    };
  }

  // 2. Verify admin authentication
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return {
          success: false,
          message: 'Authentication required to upload property media.',
          error: 'UNAUTHORIZED',
        };
      }

      // Explicit database role check for admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        return {
          success: false,
          message: 'Insufficient administrative permissions to manage property media.',
          error: 'FORBIDDEN',
        };
      }

      // 3. Process buffer and upload
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const storageKey = generateCollisionResistantKey(propertyId, file.name);

      const uploadResult = await uploadPropertyMedia(buffer, storageKey, file.type);

      if (!uploadResult.success) {
        return {
          success: false,
          message: uploadResult.error || 'Failed to upload image to storage.',
          error: 'STORAGE_ERROR',
        };
      }

      return {
        success: true,
        message: 'Image successfully uploaded and optimized.',
        url: uploadResult.url,
        path: uploadResult.path,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Server error occurred during media processing.',
        error: 'SERVER_ERROR',
      };
    }
  }

  // Mock / local development mode simulation
  const mockPath = `properties/${propertyId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
  return {
    success: true,
    message: 'Image validated successfully (storage credentials unconfigured, simulated upload).',
    url: `/HomaceLogo.png`,
    path: mockPath,
  };
}

/**
 * Server action to delete a property photograph.
 * Strictly verifies admin role check before storage deletion.
 */
export async function deletePropertyImageAction(
  storagePath: string
): Promise<MediaActionResponse> {
  if (!storagePath) {
    return {
      success: false,
      message: 'No storage path provided for deletion.',
      error: 'PATH_MISSING',
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    supabaseUrl &&
    !supabaseUrl.includes('placeholder') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (isSupabaseConfigured) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          message: 'Authentication required to delete property media.',
          error: 'UNAUTHORIZED',
        };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        return {
          success: false,
          message: 'Insufficient administrative permissions to delete property media.',
          error: 'FORBIDDEN',
        };
      }

      const deleteResult = await deletePropertyMedia(storagePath);
      if (!deleteResult.success) {
        return {
          success: false,
          message: deleteResult.error || 'Failed to delete image from storage.',
          error: 'STORAGE_ERROR',
        };
      }

      return {
        success: true,
        message: 'Property photograph successfully deleted from storage.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Server error during media deletion.',
        error: 'SERVER_ERROR',
      };
    }
  }

  return {
    success: true,
    message: 'Media deletion processed (storage credentials unconfigured).',
  };
}
