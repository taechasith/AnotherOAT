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
          message: "เริ่มเซสชันไม่สำเร็จ กรุณาลองอีกครั้ง",
          timestamp: new Date().toISOString(),
        },
      ]);
    });
  }

  return (
    <section className="relative overflow-hidden rounded-xl border border-[rgba(208,188,255,0.15)] bg-[rgba(255,255,255,0.05)] px-5 py-10 backdrop-blur-[24px] sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      <AmbientBackground reducedMotion={Boolean(reducedMotion)} />

      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(208,188,255,0.2)] bg-[rgba(208,188,255,0.06)] px-3 py-1 font-label text-[10px] uppercase tracking-[0.12em] text-[#cbc3d7]">
            <Orbit className="h-3.5 w-3.5" />
            Personal Reflection Engine
          </div>

          <div className="space-y-3">
            <h1 className="font-display font-bold text-4xl leading-tight text-[#e8dff5] sm:text-5xl lg:text-6xl">
              another oat
            </h1>
            <p className="text-base leading-7 text-[#cbc3d7] max-w-lg">
              พื้นที่ทบทวนตัวเอง — แยกสิ่งที่ควรรับฟังจากสิ่งที่ควรปล่อยไป
              ทุกเซสชันดึงข้อมูลสดจากอินเทอร์เน็ต จำแนกสัญญาณ และเตรียมบริบทก่อนเปิดบทสนทนา
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button onClick={() => void handleStartSession()} size="lg" type="button">
              {starting ? "กำลังเตรียมข้อมูล..." : "เริ่มเซสชัน"}
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/chat">
                เข้าสู่พื้นที่ทำงาน
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <SessionStartPanel active={starting} events={events} session={completedSession} />
        </div>

        <div className="relative mt-6 lg:mt-0">
          <motion.div
            animate={reducedMotion ? undefined : { rotate: 360 }}
            className="absolute inset-0 rounded-full border border-[rgba(208,188,255,0.15)]"
            transition={reducedMotion ? undefined : { repeat: Number.POSITIVE_INFINITY, duration: 24, ease: "linear" }}
          />
          <div className="absolute inset-10 rounded-full border border-[rgba(208,188,255,0.1)]" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(208,188,255,0.3),transparent_65%)] blur-3xl" />
          <div className="relative mx-auto aspect-square max-w-[260px] overflow-hidden rounded-full border-2 border-[rgba(208,188,255,0.25)] bg-[rgba(208,188,255,0.05)] sm:max-w-[320px] lg:max-w-[380px]">
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
