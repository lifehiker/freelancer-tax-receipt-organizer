"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  id: string;
  endpoint: string;
  onDelete?: () => void;
}

export function DeleteButton({ id, endpoint, onDelete }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    setLoading(true);
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      onDelete?.();
      router.refresh();
    } catch {
      alert("Failed to delete entry. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
