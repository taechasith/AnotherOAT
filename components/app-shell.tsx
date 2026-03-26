import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { getResolvedAssets } from "@/src/lib/assets";
import { siteConfig } from "@/src/config/site";

export function AppShell({
  children,
  eyebrow,
}: {
  children: ReactNode;
  eyebrow?: ReactNode;
}) {
  const assets = getResolvedAssets();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(circle at top, rgba(190,150,255,0.22), transparent 28%), radial-gradient(circle at 80% 20%, rgba(118,69,255,0.18), transparent 20%), linear-gradient(180deg, rgba(18,14,29,0.98), rgba(10,10,16,1))",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20 mix-blend-screen dark:opacity-25"
        style={{ backgroundImage: `url(${assets.heroNoise})` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-contain bg-right-top bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${assets.ambientGlow})` }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              alt={`${siteConfig.name} logo`}
              className="h-10 w-10 rounded-full border border-white/15 bg-white/10 object-cover p-2"
              src={assets.logo}
            />
            <div>
              <p className="font-serif text-lg tracking-[0.08em] text-white/75">
                another oat
              </p>
              {eyebrow ? <div className="text-sm text-white/60">{eyebrow}</div> : null}
            </div>
          </div>
          <ThemeToggle />
        </header>
        {children}
      </div>
    </div>
  );
}
