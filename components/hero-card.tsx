"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Orbit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { SessionStartPanel } from "@/components/session-start-panel";
import { siteConfig } from "@/src/config/site";
import type { SessionProgressEvent, SessionState } from "@/src/lib/types";

export function HeroCard({ avatar }: { avatar: string }) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
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
          message: "การเริ่มเซสชันมีปัญหา กรุณาลองใหม่อีกครั้ง",
          timestamp: new Date().toISOString(),
        },
      ]);
    });
  }

  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-white/12 bg-white/4.5 px-5 py-6 shadow-glow backdrop-blur-xl sm:px-8 sm:py-8 lg:px-10 lg:py-10">
      <AmbientBackground reducedMotion={Boolean(reducedMotion)} />

      <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/56">
            <Orbit className="h-3.5 w-3.5" />
            Reflective research session
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl font-serif text-5xl leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              another oat
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/66 sm:text-lg">
              {siteConfig.shortDescription} เมื่อเริ่มเซสชัน ระบบจะแสดงหลักฐานการดึงข้อมูลสด
              การคัดกรอง และการสร้างสภาวะใจอย่างเป็นขั้นตอน
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void handleStartSession()} size="lg" type="button">
              {starting ? "กำลังเริ่มต้นและ populate ข้อมูล..." : "เริ่ม session พร้อมดูการดึงข้อมูลสด"}
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/chat">
                ไปยัง workspace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <SessionStartPanel active={starting} events={events} session={completedSession} />
        </div>

        <div className="relative">
          <motion.div
            animate={reducedMotion ? undefined : { rotate: 360 }}
            className="absolute inset-0 rounded-full border border-white/10"
            transition={reducedMotion ? undefined : { repeat: Number.POSITIVE_INFINITY, duration: 24, ease: "linear" }}
          />
          <div className="absolute inset-10 rounded-full border border-white/8" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(191,154,255,0.42),transparent_62%)] blur-3xl" />
          <div className="relative mx-auto aspect-square max-w-[420px] overflow-hidden rounded-full border border-white/12 bg-white/8 p-4">
            <img
              alt="รูปแทนตัวของโอต"
              className="h-full w-full rounded-full object-cover"
              src={avatar}
            />
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
        className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(186,145,255,0.36),transparent_70%)] blur-3xl"
        transition={reducedMotion ? undefined : { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        animate={reducedMotion ? undefined : { x: [0, -18, 0], y: [0, 12, 0] }}
        className="absolute right-0 top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(99,174,255,0.22),transparent_72%)] blur-3xl"
        transition={reducedMotion ? undefined : { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </>
  );
}
