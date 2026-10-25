'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { uploadPropertyMedia } from '@/actions/properties';
import {
  Upload,
  Link as LinkIcon,
  Trash2,
  Star,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface ImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  featuredImage: string | null;
  onFeaturedChange: (img: string | null) => void;
}

export default function ImageManager({
  images,
  onChange,
  featuredImage,
  onFeaturedChange,
}: ImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Client validation
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(`"${file.name}" is not a supported format. Please use JPEG, PNG, or WebP.`);
        setUploading(false);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the 10MB limit.`);
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadPropertyMedia(formData);
      if (res.success && res.url) {
        newUrls.push(res.url);
      } else {
        setErrorMessage(res.message || `Failed to upload "${file.name}".`);
      }
    }

    if (newUrls.length > 0) {
      const updated = [...images, ...newUrls];
      onChange(updated);
      if (!featuredImage) {
        onFeaturedChange(newUrls[0]);
      }
      setSuccessMessage(`Successfully uploaded ${newUrls.length} image${newUrls.length > 1 ? 's' : ''}.`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploading(false);
  };

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    const trimmed = manualUrl.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/')) {
      setErrorMessage('Please enter a valid HTTP/HTTPS URL or root-relative path.');
      return;
    }

    const updated = [...images, trimmed];
    onChange(updated);
    if (!featuredImage) {
      onFeaturedChange(trimmed);
    }

    setManualUrl('');
    setShowUrlInput(false);
    setErrorMessage(null);
    setSuccessMessage('Image URL added to gallery.');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const removedUrl = images[indexToRemove];
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);

    if (featuredImage === removedUrl) {
      onFeaturedChange(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const reordered = [...images];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    onChange(reordered);
  };

  const handleSetCover = (url: string) => {
    onFeaturedChange(url);
    setSuccessMessage('Cover image updated.');
  };

  return (
    <div className="space-y-4">
      {/* Header and Upload Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Property Media &amp; Photo Gallery
          </label>
          <p className="text-[11px] text-slate-500">
            Upload JPG, PNG, or WebP images (max 10MB each). Reorder and select the cover display.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="property-file-upload"
            disabled={uploading}
          />

          <label
            htmlFor="property-file-upload"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs ${
              uploading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-brand-navy hover:bg-brand-navy-light text-white'
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-brand-copper" />
                <span>Upload Photos</span>
              </>
            )}
          </label>

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Add by URL</span>
          </button>
        </div>
      </div>

      {/* URL Input Form */}
      {showUrlInput && (
        <form onSubmit={handleAddManualUrl} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="Paste direct image URL (https://...)"
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-azure"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-brand-navy text-white text-xs font-semibold rounded-lg hover:bg-brand-navy-light transition-colors"
          >
            Add Image
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Notifications */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-xl">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Gallery Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          {images.map((url, idx) => {
            const isCover = featuredImage === url || (!featuredImage && idx === 0);

            return (
              <div
                key={idx}
                className={`group relative rounded-xl border overflow-hidden bg-slate-100 flex flex-col ${
                  isCover ? 'ring-2 ring-brand-copper border-brand-copper' : 'border-slate-200'
                }`}
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-4/3 w-full bg-slate-200 overflow-hidden">
                  <Image
                    src={url}
                    alt={`Property image ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="200px"
                  />

                  {/* Cover Badge */}
                  {isCover && (
                    <div className="absolute top-2 left-2 bg-brand-navy/90 backdrop-blur-xs text-brand-copper text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 fill-brand-copper" />
                      <span>COVER</span>
                    </div>
                  )}

                  {/* Image Counter */}
                  <span className="absolute bottom-2 right-2 bg-slate-900/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </span>
                </div>

                {/* Card Controls Bar */}
                <div className="p-2 bg-white flex items-center justify-between border-t border-slate-100 text-xs">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveImage(idx, 'left')}
                      className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                      title="Move Earlier"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMoveImage(idx, 'right')}
                      className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
                      title="Move Later"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Set Cover or Remove */}
                  <div className="flex items-center gap-1">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(url)}
                        className="text-[10px] text-brand-azure hover:text-brand-navy font-semibold px-1.5 py-0.5 rounded hover:bg-slate-50"
                        title="Set as Cover Photo"
                      >
                        Set Cover
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 space-y-2">
          <Upload className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-semibold text-slate-600">No images added yet</p>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            Upload multiple photos or add direct image URLs. High-resolution photos increase listing engagement significantly.
          </p>
        </div>
      )}
    </div>
  );
}
