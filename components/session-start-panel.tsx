"use client";

import { LoaderCircle, Radio, Sparkles } from "lucide-react";

import { cn } from "@/src/lib/utils";
import type { SessionProgressEvent } from "@/src/lib/types";

export function SessionStartPanel({
  events,
  active,
}: {
  events: SessionProgressEvent[];
  active: boolean;
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/15 bg-black/20 p-4 backdrop-blur-xl dark:bg-black/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/45">สดจากการเริ่มเซสชัน</p>
          <h3 className="mt-2 font-serif text-xl text-white">ตัวติดตามการดึงข้อมูลแบบเรียลไทม์</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
          <Radio className="h-3.5 w-3.5" />
          {active ? "กำลังทำงาน" : "พร้อมใช้งาน"}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {events.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/55">
            เมื่อกดเริ่มต้นเซสชัน ระบบจะแสดงขั้นตอนการดึงข่าว คัดกรอง ตัดข้อมูลซ้ำ และสรุปสภาพใจแบบสด ๆ ตรงนี้
          </div>
        ) : (
          events.slice(-6).map((event, index) => (
            <div
              className={cn(
                "rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/80 transition",
                index === events.slice(-6).length - 1 ? "bg-white/10" : "bg-white/5",
              )}
              key={event.id}
            >
              <div className="flex items-start gap-3">
                {active && index === events.slice(-6).length - 1 ? (
                  <LoaderCircle className="mt-0.5 h-4 w-4 animate-spin text-white/80" />
                ) : (
                  <Sparkles className="mt-0.5 h-4 w-4 text-white/60" />
                )}
                <div className="min-w-0">
                  <p>{event.message}</p>
                  <p className="mt-1 text-xs text-white/45">
                    {[event.detail, event.source, event.count ? `${event.count} รายการ` : undefined]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
