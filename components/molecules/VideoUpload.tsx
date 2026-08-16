"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Video, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { getPublicUrl } from "@/lib/supabase/storage";
import { toast } from "react-hot-toast";

interface VideoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
  aspectRatio?: string;
  folder?: string;
  onUploading?: (uploading: boolean) => void;
}

export default function VideoUpload({
  value,
  onChange,
  className,
  label,
  aspectRatio = "aspect-video",
  folder = "media",
  onUploading,
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const setUploadState = (state: boolean) => {
    setIsUploading(state);
    onUploading?.(state);
  };
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if value changes externally
  React.useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const allowedTypes = ["video/mp4", "video/quicktime", "video/webm"];
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const allowedExts = ["mp4", "mov", "webm"];

    if (!allowedTypes.includes(file.type) && (!fileExt || !allowedExts.includes(fileExt))) {
      toast.error("Unsupported format. Use MP4, MOV, or WEBM.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast.error("File is too large. Maximum size is 100MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploadState(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Pass replacePath if there is an existing relative path
      const replaceParam = value && !value.startsWith("http") && !value.startsWith("/")
        ? `&replacePath=${encodeURIComponent(value)}`
        : "";

      const response = await fetch(`/api/upload?path=${folder}${replaceParam}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success && data.url) {
        onChange(data.url);
        setPreview(data.url);
        toast.success("Video uploaded successfully!");
      } else {
        toast.error(data.message || "Failed to upload video.");
        setPreview(value || null);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("An error occurred during upload.");
      setPreview(value || null);
    } finally {
      setUploadState(false);
    }
  };

  const removeVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="block text-sm font-semibold text-gray-900">{label}</label>}

      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "relative w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
          aspectRatio,
          preview
            ? "border-blue-900/50 bg-blue-50/5"
            : "border-gray-200 bg-gray-50 hover:border-blue-900/30 hover:bg-gray-100/50",
          isUploading && "cursor-not-allowed"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="video/mp4,video/quicktime,video/webm"
          className="hidden"
          disabled={isUploading}
        />

        {preview ? (
          <>
            <video
              src={getPublicUrl(preview)}
              className="w-full h-full object-cover"
              muted
              playsInline
              loop
              autoPlay
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-xs font-bold flex items-center gap-2">
                <Upload size={16} /> Change Video
              </p>
            </div>
            {!isUploading && (
              <button
                type="button"
                onClick={removeVideo}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all"
              >
                <X size={14} />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <div className="p-3 bg-white rounded-full shadow-sm border border-gray-100">
              <Video size={24} className="text-blue-900/40" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-gray-900">Click to upload</p>
              <p className="text-[10px]">MP4, MOV or WEBM (Max. 100MB)</p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10">
            <Loader2 className="animate-spin text-blue-900 mb-2" size={32} />
            <p className="text-xs font-bold text-blue-900 uppercase tracking-widest">Uploading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
