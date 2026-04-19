"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
interface ToastItem { id: string; title?: string; description?: string; variant?: "default" | "destructive"; }
const ToastCtx = React.createContext<{ toasts: ToastItem[]; toast: (t: Omit<ToastItem, "id">) => void; dismiss: (id: string) => void; } | null>(null);
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const toast = React.useCallback((t: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p, { ...t, id }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 5000);
  }, []);
  const dismiss = React.useCallback((id: string) => setToasts((p) => p.filter((x) => x.id !== id)), []);
  return (
    <ToastCtx.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
        {toasts.map((t) => (
          <div key={t.id} className={cn("pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg", t.variant === "destructive" ? "border-red-600 bg-red-600 text-white" : "border-slate-200 bg-white text-slate-950")}>
            <div className="grid gap-1">
              {t.title && <div className="text-sm font-semibold">{t.title}</div>}
              {t.description && <div className="text-sm opacity-90">{t.description}</div>}
            </div>
            <button onClick={() => dismiss(t.id)} className="absolute right-2 top-2 rounded-md p-1 opacity-50 hover:opacity-100 text-xs">x</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export function useToast() {
  const ctx = React.useContext(ToastCtx);
  if (!ctx) return { toast: (t: Omit<ToastItem, "id">) => console.log("Toast:", t), dismiss: (_: string) => {} };
  return ctx;
}
