import type { ReactNode } from "react";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { getResolvedAssets } from "@/src/lib/assets";
import { siteConfig } from "@/src/config/site";

export function AppShell({
  children,
  eyebrow,
  viewportLocked = false,
}: {
  children: ReactNode;
  eyebrow?: ReactNode;
  viewportLocked?: boolean;
}) {
  const assets = getResolvedAssets();

  return (
    <div
      className={`relative ${viewportLocked ? "h-[100dvh] overflow-hidden" : "min-h-[100dvh] overflow-hidden"} bg-background text-foreground`}
    >
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

      <div
        className={`relative mx-auto flex w-full max-w-7xl flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6 lg:px-10 ${viewportLocked ? "h-full" : "min-h-[100dvh] pb-12"}`}
      >
        <header className="flex shrink-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4 md:justify-start md:gap-6">
              <div className="min-w-0 flex items-center gap-3">
                <img
                  alt={`${siteConfig.name} logo`}
                  className="h-10 w-10 rounded-full border border-white/15 bg-white/10 object-cover p-2"
                  src={assets.logo}
                />
                <div className="min-w-0">
                  <p className="truncate font-serif text-base tracking-[0.08em] text-white/75 sm:text-lg">another oat</p>
                  {eyebrow ? <div className="line-clamp-2 text-sm text-white/60">{eyebrow}</div> : null}
                </div>
              </div>
              <div className="md:hidden">
                <ThemeToggle />
              </div>
            </div>

            <nav className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 md:mt-3">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/chat">Chat</NavLink>
              <NavLink href="/analysis">Analysis</NavLink>
              <NavLink href="/timeline">Timeline</NavLink>
            </nav>
          </div>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/62 transition hover:bg-white/10 hover:text-white"
      href={href}
    >
      {children}
    </Link>
  );
}
