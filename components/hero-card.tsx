"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { MotionWrapper } from "@/components/motion-wrapper";
import { SessionStartPanel } from "@/components/session-start-panel";
import { siteConfig } from "@/src/config/site";
import type { SessionProgressEvent } from "@/src/lib/types";

export function HeroCard({ avatar }: { avatar: string }) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [events, setEvents] = useState<SessionProgressEvent[]>([]);

  async function handleStartSession() {
    setStarting(true);
    setEvents([]);

    const source = new EventSource("/api/session-start/stream");

    source.addEventListener("progress", (event) => {
      const payload = JSON.parse(event.data) as SessionProgressEvent;
      setEvents((current) => [...current, payload]);
    });

    source.addEventListener("completed", () => {
      source.close();
      setStarting(false);
      router.push("/chat");
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
    <MotionWrapper className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-glow backdrop-blur-xl sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-white/55">พื้นที่สะท้อนใจ</p>
            <h1 className="max-w-2xl font-serif text-5xl leading-tight text-white sm:text-6xl">
              another oat
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              {siteConfig.shortDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void handleStartSession()} size="lg" type="button">
              {starting ? "กำลังเริ่มต้น..." : "เริ่มต้นเซสชัน"}
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/timeline">ดูเส้นเวลาความรู้สึก</Link>
            </Button>
          </div>

          <SessionStartPanel active={starting} events={events} />
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(173,127,255,0.45),transparent_60%)] blur-3xl" />
          <div className="relative mx-auto aspect-square max-w-[360px] overflow-hidden rounded-[2rem] border border-white/15 bg-white/8 p-3 backdrop-blur">
            <img
              alt="รูปแทนตัวของโอต"
              className="h-full w-full rounded-[1.5rem] object-cover"
              src={avatar}
            />
          </div>
        </div>
      </div>
    </MotionWrapper>
  );
}
