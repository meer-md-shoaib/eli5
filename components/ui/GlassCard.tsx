import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
}

export function GlassCard({ as: Tag = "div", className, children, ...props }: GlassCardProps) {
  return (
    <Tag className={cn("glass-card", className)} {...props}>
      {children}
    </Tag>
  );
}
