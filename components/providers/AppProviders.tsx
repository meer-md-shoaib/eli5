"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/hooks/useTheme";
import { ExplainerProvider } from "@/hooks/useExplainer";
import { SessionProvider } from "./SessionProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ExplainerProvider>{children}</ExplainerProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
