"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/hooks/useTheme";
import { ExplainerProvider } from "@/hooks/useExplainer";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ExplainerProvider>{children}</ExplainerProvider>
    </ThemeProvider>
  );
}
