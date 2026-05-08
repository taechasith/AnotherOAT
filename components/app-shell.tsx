"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, BarChart3, Radio } from "lucide-react";

import { siteConfig } from "@/src/config/site";
import { useLang, useT } from "@/src/lib/i18n";

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

const NAV_HREFS = [
  { href: "/", key: "home" as const, icon: Home },
  { href: "/chat", key: "reflect" as const, icon: MessageCircle },
  { href: "/analysis", key: "insights" as const, icon: BarChart3 },
];

export function AppShell({
  children,
  eyebrow: _eyebrow,
  viewportLocked = false,
  assets,
}: {
  children: ReactNode;
  eyebrow?: ReactNode;
  viewportLocked?: boolean;
  assets?: ResolvedAssets;
}) {
  const resolvedAssets = assets ?? DEFAULT_ASSETS;
  const pathname = usePathname();
  const t = useT();
  const { lang, setLang } = useLang();

  return (
    <div
      className={`relative ${viewportLocked ? "h-dvh overflow-hidden" : "min-h-dvh"} bg-[#151120] text-[#e8dff5]`}
    >
      {/* Ambient background glows */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(139,92,246,0.18), transparent), radial-gradient(ellipse 60% 30% at 80% 10%, rgba(88,51,153,0.12), transparent)",
        }}
      />

      {/* Page content wrapper */}
      <div
        className={`relative z-10 mx-auto flex w-full max-w-2xl lg:max-w-6xl flex-col px-4 sm:px-5 lg:px-8 ${
          viewportLocked ? "h-dvh" : "min-h-dvh pb-20 md:pb-10"
        }`}
      >
        {/* Top header */}
        <header className="sticky top-0 z-40 -mx-4 sm:-mx-5 lg:-mx-8 flex h-16 items-center justify-between px-4 sm:px-5 lg:px-8 bg-[rgba(21,17,32,0.92)] backdrop-blur-xl border-b border-[rgba(208,188,255,0.08)]">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                alt={`${siteConfig.name} logo`}
                className="h-10 w-10 rounded-full border-2 border-[rgba(208,188,255,0.35)] object-cover"
                src={resolvedAssets.logo}
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#d0bcff] border-2 border-[#151120] animate-pulse" />
            </div>
            <div>
              <p className="font-display font-bold text-[#e8dff5] text-[15px] leading-tight">
                Another OAT
              </p>
              <p className="font-label text-[9px] text-[#958ea0] uppercase tracking-[0.16em] mt-0.5">
                {t.header.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Desktop nav */}
            <nav className="hidden items-center gap-0.5 md:flex">
              {NAV_HREFS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    className={`flex items-center gap-1.5 font-label text-[10px] uppercase tracking-[0.1em] rounded-full px-3 py-1.5 transition ${
                      isActive
                        ? "text-[#d0bcff] bg-[rgba(208,188,255,0.12)]"
                        : "text-[#494454] hover:text-[#cbc3d7] hover:bg-[rgba(255,255,255,0.04)]"
                    }`}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden lg:inline">{t.nav[item.key]}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Language toggle */}
            <div className="flex items-center rounded-full border border-[rgba(208,188,255,0.15)] bg-[rgba(255,255,255,0.04)] p-0.5">
              <button
                className={`rounded-full px-2.5 py-1 font-label text-[10px] uppercase tracking-[0.08em] transition-all ${
                  lang === "en"
                    ? "bg-[#d0bcff] text-[#23005c] font-semibold"
                    : "text-[#494454] hover:text-[#958ea0]"
                }`}
                onClick={() => setLang("en")}
                type="button"
              >
                EN
              </button>
              <button
                className={`rounded-full px-2.5 py-1 font-label text-[10px] uppercase tracking-[0.08em] transition-all ${
                  lang === "th"
                    ? "bg-[#d0bcff] text-[#23005c] font-semibold"
                    : "text-[#494454] hover:text-[#958ea0]"
                }`}
                onClick={() => setLang("th")}
                type="button"
              >
                TH
              </button>
            </div>

            <button
              className="flex items-center justify-center rounded-full text-[#958ea0] hover:text-[#d0bcff] transition-colors p-1.5"
              type="button"
              aria-label="Signal status"
            >
              <Radio className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className={`flex-1 py-4 ${viewportLocked ? "min-h-0 overflow-hidden pb-16 md:pb-4" : ""}`}>{children}</main>
      </div>

      {/* Bottom nav — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around bg-[rgba(34,29,45,0.97)] backdrop-blur-xl border-t border-[rgba(208,188,255,0.08)] shadow-[0_-4px_24px_rgba(139,92,246,0.12)] md:hidden">
        {NAV_HREFS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              className={`flex flex-col items-center gap-1 px-6 py-1 transition-all active:scale-90 ${
                isActive ? "text-[#d0bcff]" : "text-[#494454] hover:text-[#958ea0]"
              }`}
              href={item.href}
              key={item.href}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="font-label text-[9px] uppercase tracking-[0.1em]">
                {t.nav[item.key]}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
