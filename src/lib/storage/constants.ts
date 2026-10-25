export const MEDIA_CONFIG = {
  BUCKET_NAME: 'property-media',
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5 MB
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
  ],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  FALLBACK_PLACEHOLDER: '/HomaceLogo.png',
} as const;
