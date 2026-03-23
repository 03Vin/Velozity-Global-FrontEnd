import * as React from "react"
import { cn } from "../../lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xs';
}

function Avatar({ className, initials, color = '#3b82f6', size = 'md', ...props }: AvatarProps) {
  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full items-center justify-center font-bold text-white border-2 border-background shadow-md",
        sizes[size],
        className
      )}
      style={{ backgroundColor: color }}
      {...props}
    >
      {initials}
    </div>
  )
}

export { Avatar }
