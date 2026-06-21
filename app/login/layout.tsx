import type { Metadata } from "next";
import { Suspense } from "react";
import { THEME_INIT_SCRIPT } from "@/hooks/useTheme";
import { AuroraField } from "@/components/ui/AuroraField";

export const metadata: Metadata = {
  title: "Sign in — ELI5",
  description: "Sign in to access ELI5.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      <AuroraField />
      <Suspense>{children}</Suspense>
    </>
  );
}
