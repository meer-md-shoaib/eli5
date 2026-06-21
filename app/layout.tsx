import type { Metadata, Viewport } from "next";
import "./globals.css";
import { THEME_INIT_SCRIPT } from "@/hooks/useTheme";
import { AppProviders } from "@/components/providers/AppProviders";
import { AuroraField } from "@/components/ui/AuroraField";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CreditPopup } from "@/components/layout/CreditPopup";

export const metadata: Metadata = {
  title: "ELI5 | Explain Like I'm 5",
  description:
    "ELI5 turns any topic into a clear, witty explanation in the style, depth, and language you choose. Feed it your confusion, get back clarity.",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6fc" },
    { media: "(prefers-color-scheme: dark)", color: "#07070f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <AppProviders>
          <AuroraField />
          <CursorGlow />
          <Header />
          {children}
          <CreditPopup />
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
