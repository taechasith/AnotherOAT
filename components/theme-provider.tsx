"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import { siteConfig } from "@/src/config/site";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme={siteConfig.theme.defaultTheme}
      enableSystem={siteConfig.theme.enableSystem}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
