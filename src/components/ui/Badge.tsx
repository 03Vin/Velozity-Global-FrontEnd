import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    secondary: 'bg-white/5 text-slate-300 border-white/10',
    outline: 'text-slate-400 border-white/10 hover:border-white/20',
    destructive: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider transition-all duration-300",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
