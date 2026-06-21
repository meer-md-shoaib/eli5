"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  active?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, active, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn("icon-button", active && "icon-button-active", className)}
      {...props}
    >
      {children}
    </button>
  );
});
