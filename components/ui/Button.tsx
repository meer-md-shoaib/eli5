"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger-ghost";
  icon?: ReactNode;
  iconPosition?: "leading" | "trailing";
  magnetic?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", icon, iconPosition = "trailing", magnetic = true, className, children, ...props },
  forwardedRef
) {
  const magneticRef = useMagnetic<HTMLButtonElement>(0.22);

  return (
    <button
      ref={(node) => {
        if (magnetic) magneticRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      className={cn(
        "btn",
        variant === "primary" && "btn-primary",
        variant === "secondary" && "btn-secondary",
        variant === "danger-ghost" && "btn-secondary btn-danger",
        className
      )}
      {...props}
    >
      {icon && iconPosition === "leading" && <span className="btn-icon" aria-hidden="true">{icon}</span>}
      <span className="btn-label">{children}</span>
      {icon && iconPosition === "trailing" && <span className="btn-icon btn-icon-trailing" aria-hidden="true">{icon}</span>}
    </button>
  );
});
