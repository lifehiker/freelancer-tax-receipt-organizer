import * as React from "react";
import { cn } from "@/lib/utils";
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}
const vCls = {
  default: "bg-teal-700 text-white",
  secondary: "bg-slate-200 text-slate-900",
  destructive: "bg-red-600 text-white",
  outline: "border border-slate-300 text-slate-700",
  success: "bg-green-100 text-green-800",
};
function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors", vCls[variant], className)} {...props} />;
}
export { Badge };
