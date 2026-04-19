"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
interface TabsCtx { value: string; onValueChange: (v: string) => void; }
const Ctx = React.createContext<TabsCtx | null>(null);
function Tabs({ defaultValue = "", value, onValueChange, className, children }: { defaultValue?: string; value?: string; onValueChange?: (v: string) => void; className?: string; children: React.ReactNode; }) {
  const [iv, setIv] = React.useState(defaultValue);
  const cv = value !== undefined ? value : iv;
  const hc = onValueChange || setIv;
  return <Ctx.Provider value={{ value: cv, onValueChange: hc }}><div className={className}>{children}</div></Ctx.Provider>;
}
function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800", className)} {...props} />;
}
function TabsTrigger({ className, value, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const ctx = React.useContext(Ctx);
  const isActive = ctx?.value === value;
  return <button onClick={() => ctx?.onValueChange(value)} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50", isActive ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50" : "hover:bg-white/50", className)} {...props} />;
}
function TabsContent({ className, value, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const ctx = React.useContext(Ctx);
  if (ctx?.value !== value) return null;
  return <div className={cn("mt-2", className)} {...props}>{children}</div>;
}
export { Tabs, TabsList, TabsTrigger, TabsContent };
