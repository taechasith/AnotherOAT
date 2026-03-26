import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.shortDescription,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
