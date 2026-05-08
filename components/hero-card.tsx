"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { SessionStartPanel } from "@/components/session-start-panel";
import { useT } from "@/src/lib/i18n";
import type { SessionProgressEvent, SessionState } from "@/src/lib/types";

export function HeroCard({ avatar }: { avatar: string }) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const t = useT();
  const [starting, setStarting] = useState(false);
  const [events, setEvents] = useState<SessionProgressEvent[]>([]);
  const [completedSession, setCompletedSession] = useState<SessionState | null>(null);

  async function handleStartSession() {
    setStarting(true);
    setEvents([]);
    setCompletedSession(null);

    const source = new EventSource("/api/session-start/stream");

    source.addEventListener("progress", (event) => {
      const payload = JSON.parse(event.data) as SessionProgressEvent;
      setEvents((current) => [...current, payload]);
    });

    source.addEventListener("completed", (event) => {
      const payload = JSON.parse(event.data) as { session: SessionState; events: SessionProgressEvent[] };
      setCompletedSession(payload.session);
      source.close();
      setStarting(false);
      setTimeout(() => router.push("/chat"), 900);
    });

    source.addEventListener("error", () => {
      source.close();
      setStarting(false);
      setEvents((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          phase: "error",
          message: "เริ่มเซสชันไม่สำเร็จ กรุณาลองอีกครั้ง",
          timestamp: new Date().toISOString(),
        },
      ]);
    });
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[rgba(208,188,255,0.12)] bg-[rgba(255,255,255,0.03)] backdrop-blur-[24px]">
      <AmbientBackground reducedMotion={Boolean(reducedMotion)} />

      <div className="relative px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="flex flex-col items-center text-center gap-8 lg:flex-row lg:items-center lg:text-left lg:gap-16">

          {/* Text side — below avatar on mobile, left on desktop */}
          <div className="flex flex-col items-center gap-6 lg:items-start lg:flex-1 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(208,188,255,0.2)] bg-[rgba(208,188,255,0.06)] px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.14em] text-[#cbc3d7]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d0bcff] animate-pulse" />
              {t.hero.badge}
            </div>

            <div className="space-y-3">
              <h1 className="font-display font-bold text-[44px] leading-none text-[#e8dff5] sm:text-5xl lg:text-6xl">
                another oat
              </h1>
              <p className="text-[14px] leading-7 text-[#958ea0] max-w-[280px] sm:max-w-sm lg:max-w-md">
                {t.hero.tagline}{" "}
                <span className="text-[#d0bcff]">{t.hero.taglineAccent}</span>
                <br />
                {t.hero.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-[260px] lg:max-w-xs lg:flex-row lg:w-auto">
              <Button onClick={() => void handleStartSession()} size="lg" type="button">
                {starting ? t.hero.preparing : t.hero.startSession}
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/chat">
                  {t.hero.enterWorkspace}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <SessionStartPanel active={starting} events={events} session={completedSession} />
          </div>

          {/* Avatar side — top on mobile, right on desktop */}
          <div className="relative shrink-0 order-1 lg:order-2">
            <motion.div
              animate={reducedMotion ? undefined : { rotate: 360 }}
              className="absolute inset-[-12px] rounded-full border border-[rgba(208,188,255,0.12)]"
              transition={reducedMotion ? undefined : { repeat: Number.POSITIVE_INFINITY, duration: 24, ease: "linear" }}
            />
            <div className="absolute inset-[-12px] rounded-full bg-[radial-gradient(circle,rgba(208,188,255,0.2),transparent_65%)] blur-3xl" />
            <div className="relative h-44 w-44 overflow-hidden rounded-full border-2 border-[rgba(208,188,255,0.35)] sm:h-52 sm:w-52 lg:h-64 lg:w-64 xl:h-72 xl:w-72">
              <img
                alt="รูปแทนตัวของโอต"
                className="h-full w-full object-cover"
                src={avatar}
              />
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full border border-[rgba(208,188,255,0.3)] bg-[rgba(21,17,32,0.85)] px-2.5 py-1 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d0bcff] animate-pulse" />
              <span className="font-label text-[9px] uppercase tracking-[0.14em] text-[#d0bcff]">Live</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function AmbientBackground({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <motion.div
        animate={reducedMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
        className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(186,145,255,0.28),transparent_70%)] blur-3xl pointer-events-none"
        transition={reducedMotion ? undefined : { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        animate={reducedMotion ? undefined : { x: [0, -18, 0], y: [0, 12, 0] }}
        className="absolute right-0 top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(99,174,255,0.15),transparent_72%)] blur-3xl pointer-events-none"
        transition={reducedMotion ? undefined : { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </>
  );
}
