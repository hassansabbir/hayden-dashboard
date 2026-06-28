"use client";

import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ImageUpload = ({
  label,
  value,
  onChange,
  className = "",
  aspectRatio = "aspect-video"
}: {
  label: string,
  value: string | File | null,
  onChange: (file: File) => void,
  className?: string,
  aspectRatio?: string
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === 'string' && value.startsWith('http')) {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className={className}>
      <label className="block text-[11px] font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">{label}</label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all ${aspectRatio} bg-slate-50 flex flex-col items-center justify-center gap-2`}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <div className="flex flex-col items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-md border border-white/30">
                  <Upload size={24} className="text-white" />
                </div>
                <span className="text-sm font-bold text-white">Replace Image</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 rounded-full bg-white text-slate-400 group-hover:text-emerald-500 transition-all shadow-sm group-hover:shadow-md">
              <Upload size={32} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-600">Click to upload</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG or WebP</p>
            </div>
          </>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default ImageUpload;