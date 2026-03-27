"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, MessageCircle, BarChart3, Clock } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/src/config/site";

export type ResolvedAssets = {
  avatar: string;
  logo: string;
  heroNoise: string;
  ambientGlow: string;
};

const DEFAULT_ASSETS: ResolvedAssets = {
  avatar: "/placeholder-avatar.png",
  logo: "/placeholder-logo.png",
  heroNoise: "/placeholder-noise.png",
  ambientGlow: "/placeholder-glow.png",
};

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/analysis", label: "Analysis", icon: BarChart3 },
  { href: "/timeline", label: "Timeline", icon: Clock },
];

export function AppShell({
  children,
  eyebrow,
  viewportLocked = false,
  assets,
}: {
  children: ReactNode;
  eyebrow?: ReactNode;
  viewportLocked?: boolean;
  assets?: ResolvedAssets;
}) {
  const resolvedAssets = assets ?? DEFAULT_ASSETS;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div
      className={`relative ${viewportLocked ? "h-dvh overflow-hidden" : "min-h-dvh overflow-hidden"} bg-background text-foreground`}
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
        style={{ backgroundImage: `url(${resolvedAssets.heroNoise})` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-contain bg-top-right bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${resolvedAssets.ambientGlow})` }}
      />

      <div
        className={`relative mx-auto flex w-full max-w-7xl flex-col px-3 sm:px-6 lg:px-10 ${viewportLocked ? "h-full" : "min-h-dvh pb-12"}`}
      >
        <header
          className={`sticky top-0 z-40 -mx-3 px-3 transition-all duration-300 md:relative md:mx-0 md:px-0 ${
            scrolled ? "bg-background/80 backdrop-blur-xl" : ""
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/5 py-3 md:border-none md:py-4">
            <div className="flex items-center gap-3">
              <img
                alt={`${siteConfig.name} logo`}
                className="h-9 w-9 shrink-0 rounded-full border border-white/15 bg-white/10 object-cover p-1.5 sm:h-10 sm:w-10 sm:p-2"
                src={resolvedAssets.logo}
              />
              <div className="min-w-0">
                <p className="truncate font-serif text-base tracking-[0.08em] text-white/85 sm:text-lg">
                  another oat
                </p>
                {eyebrow ? (
                  <div className="line-clamp-1 text-xs text-white/50 sm:text-sm">{eyebrow}</div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <nav className="hidden items-center gap-1 md:flex">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/50 hover:bg-white/5 hover:text-white/70"
                      }`}
                      href={item.href}
                      key={item.href}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <button
                className="flex items-center justify-center rounded-full bg-white/5 p-2 text-white/60 transition hover:bg-white/10 hover:text-white md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="absolute left-0 right-0 top-full flex flex-col gap-1 border-b border-white/10 bg-[#0a0a10]/95 backdrop-blur-xl py-3 md:hidden">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${
                      isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5"
                    }`}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="border-t border-white/10 px-4 pt-2">
                <ThemeToggle />
              </div>
            </nav>
          )}
        </header>

        <main className="flex-1 py-4 md:py-6">{children}</main>
      </div>
    </div>
  );
}
