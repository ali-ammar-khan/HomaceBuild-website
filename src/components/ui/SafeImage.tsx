'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { MEDIA_CONFIG } from '@/lib/storage/constants';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';

export interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string | null | undefined;
  fallbackSrc?: string;
  propertyTitle?: string;
}

export function SafeImage({
  src,
  fallbackSrc = MEDIA_CONFIG.FALLBACK_PLACEHOLDER,
  alt,
  propertyTitle,
  className,
  fill,
  sizes,
  priority = false,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState<boolean>(!src);

  const isFallbackLogo = imgSrc.includes('HomaceLogo.png');

  // Descriptive alt text generation
  const descriptiveAlt =
    alt ||
    (propertyTitle
      ? `${propertyTitle} - HomaceBuild Verified Property Photograph`
      : 'HomaceBuild and Realators Property Image');

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        fill ? 'h-full w-full' : '',
        isFallbackLogo ? 'bg-brand-slate-100 flex items-center justify-center p-6' : 'bg-brand-slate-900'
      )}
    >
      <Image
        {...props}
        src={imgSrc}
        alt={descriptiveAlt}
        fill={fill}
        sizes={sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
        priority={priority}
        onError={handleError}
        className={cn(
          'transition-all duration-300',
          isFallbackLogo ? 'object-contain opacity-85' : 'object-cover',
          className
        )}
      />

      {isFallbackLogo && (
        <div
          className="absolute bottom-2 right-2 bg-brand-navy/70 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-white font-mono flex items-center gap-1 pointer-events-none"
          aria-hidden="true"
        >
          <Building2 className="w-3 h-3 text-brand-copper" />
          <span>Homace Verified</span>
        </div>
      )}
    </div>
  );
}
