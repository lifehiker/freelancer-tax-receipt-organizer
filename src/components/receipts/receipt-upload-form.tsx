"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export function ReceiptUploadForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/receipts", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Upload failed");
      }

      toast({ title: "Receipt uploaded", description: selectedFile.name });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        {selectedFile ? (
          <div>
            <p className="text-sm font-medium text-slate-900">{selectedFile.name}</p>
            <p className="text-xs text-slate-500 mt-1">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-slate-900 mb-1">
              Click to select a file
            </p>
            <p className="text-xs text-slate-500">
              Supports JPG, PNG, WebP, PDF &mdash; max 10MB
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <button
        type="submit"
        disabled={!selectedFile || isUploading}
        className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isUploading ? "Uploading..." : "Upload Receipt"}
      </button>
    </form>
  );
}
