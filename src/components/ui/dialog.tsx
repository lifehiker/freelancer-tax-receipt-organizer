"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
interface DialogProps { open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode; }
function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange?.(false)} />
      {children}
    </div>
  );
}
const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("relative z-50 grid w-full max-w-lg gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-950", className)} {...props}>{children}</div>
));
DialogContent.displayName = "DialogContent";
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("flex flex-col space-y-1.5", className)} {...props} />;
const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DialogTitle.displayName = "DialogTitle";
export { Dialog, DialogContent, DialogHeader, DialogTitle };
