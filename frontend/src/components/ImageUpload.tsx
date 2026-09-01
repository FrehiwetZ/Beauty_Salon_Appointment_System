import React, { useState, useRef } from 'react';
import { api } from '../services/api';

interface ImageUploadProps {
  label?: string;
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto';
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  folder = 'uploads',
  className = '',
  aspectRatio = 'auto',
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentDisplayImage = preview || value;

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('Image file size must be less than 15MB.');
      return;
    }

    setError(null);

    // Read and create immediate local preview
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setUploading(true);

      try {
        const response = await api.post('/upload', {
          fileName: file.name,
          fileData: base64,
          folder,
        });

        if (response.data.success && response.data.data?.url) {
          const r2Url = response.data.data.url;
          setPreview(null);
          onChange(r2Url);
        } else {
          throw new Error(response.data.message || 'Failed to upload image to Cloudflare R2');
        }
      } catch (err: any) {
        console.error('Error uploading image to R2:', err);
        setError(err.response?.data?.message || err.message || 'Image upload failed. Please try again.');
        setPreview(null);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled || uploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerSelect = () => {
    if (!disabled && !uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'wide'
      ? 'aspect-[21/9]'
      : 'min-h-[140px] max-h-[260px]';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-gray-700">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml, image/avif"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || uploading}
      />

      {currentDisplayImage ? (
        <div className={`relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm ${aspectClass}`}>
          <img
            src={currentDisplayImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />

          {uploading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4">
              <svg className="animate-spin h-7 w-7 text-pink-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span className="text-xs font-medium text-pink-200 animate-pulse">Uploading to Cloudflare R2...</span>
            </div>
          )}

          {!uploading && (
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
              <button
                type="button"
                onClick={triggerSelect}
                className="px-3 py-1.5 bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🔄</span> Change Image
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 bg-red-600/90 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🗑</span> Remove
              </button>
            </div>
          )}

          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs font-medium flex items-center gap-1 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            Cloudflare R2
          </div>
        </div>
      ) : (
        <div
          onClick={triggerSelect}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`group relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
            isDragOver
              ? 'border-pink-500 bg-pink-50/60 ring-2 ring-pink-300'
              : 'border-gray-300 hover:border-pink-400 bg-gray-50/50 hover:bg-pink-50/20'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-2">
              <svg className="animate-spin h-7 w-7 text-pink-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span className="text-xs font-medium text-pink-600 animate-pulse">Uploading to Cloudflare R2...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-pink-100 group-hover:bg-pink-200 text-pink-600 flex items-center justify-center text-xl transition-colors">
                📸
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-gray-700 group-hover:text-pink-700 transition-colors">
                  Click or drag & drop to choose image
                </p>
                <p className="text-[11px] text-gray-400">
                  PNG, JPG, WEBP or GIF (automatically stored on Cloudflare R2)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
