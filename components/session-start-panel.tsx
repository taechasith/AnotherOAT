"use client";

import { LoaderCircle, Radio, TrendingUp } from "lucide-react";

import { cn } from "@/src/lib/utils";
import type { MentionItem, SessionProgressEvent, SessionState } from "@/src/lib/types";

export function SessionStartPanel({
  events,
  active,
  session,
}: {
  events: SessionProgressEvent[];
  active: boolean;
  session?: SessionState | null;
}) {
  const chartPoints = events
    .filter((event) => typeof event.count === "number")
    .map((event, index) => ({
      x: index,
      y: event.count ?? 0,
    }));

  const mentions = session?.mentions ?? [];

  return (
    <div className="rounded-[1.75rem] border border-white/12 bg-black/20 p-4 backdrop-blur-xl dark:bg-black/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/45">Live Data Collection</p>
          <h3 className="mt-2 font-serif text-xl text-white">
            Collecting &amp; Classifying Your Data
          </h3>
          <p className="mt-2 text-sm leading-7 text-white/58">
            ระบบกำลังดึงข้อมูลจากแหล่งต่าง ๆ วิเคราะห์โทนเนื้อหา และจัดกลุ่มสัญญาณ
            เพื่อเตรียมบริบทสำหรับการสนทนา
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
          <Radio className="h-3.5 w-3.5" />
          {active ? "Live" : "Ready"}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <ResearchCard title="Realtime event population">
          <div className="h-40 rounded-2xl border border-white/8 bg-black/20 p-3 dark:bg-black/25">
            <svg className="h-full w-full" viewBox="0 0 320 120">
              <defs>
                <linearGradient id="session-line" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(214,181,255,1)" />
                  <stop offset="100%" stopColor="rgba(116,202,255,1)" />
                </linearGradient>
              </defs>
              <path
                d={buildPath(chartPoints)}
                fill="none"
                stroke="url(#session-line)"
                strokeLinecap="round"
                strokeWidth="3"
              />
              {chartPoints.map((point, index) => (
                <circle
                  cx={mapX(index, chartPoints.length)}
                  cy={mapY(point.y, chartPoints)}
                  fill="white"
                  key={`${point.x}-${point.y}`}
                  r="3.5"
                />
              ))}
            </svg>
          </div>
          <p className="mt-3 text-xs text-white/42">
            จำนวนรายการที่ดึงได้สะสมในแต่ละช่วงของกระบวนการ
          </p>
        </ResearchCard>

        <ResearchCard title="Negativity distribution">
          <BarStack
            items={buildNegativityBins(mentions).map((item) => ({
              label: item.label,
              value: item.value,
            }))}
          />
          <p className="mt-3 text-xs text-white/42">
            การกระจายของโทนเนื้อหา — มากแค่ไหนที่เป็นเชิงลบ
          </p>
        </ResearchCard>

        <ResearchCard title="Timeline density">
          <BarStack
            items={buildTimelineBins(mentions).map((item) => ({
              label: item.label,
              value: item.value,
            }))}
          />
          <p className="mt-3 text-xs text-white/42">
            ความหนาแน่นของข้อมูลตามช่วงเวลา
          </p>
        </ResearchCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ResearchCard title="Source distribution">
          <BarStack
            items={buildSourceDistribution(mentions).map((item) => ({
              label: item.label,
              value: item.value,
            }))}
          />
        </ResearchCard>

        <div className="space-y-2">
          {events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/12 bg-black/10 px-4 py-3 text-sm text-white/50 dark:bg-black/20">
              กราฟและสถิติจะแสดงแบบเรียลไทม์เมื่อเซสชันเริ่มต้น
            </div>
          ) : (
            events.slice(-5).map((event, index) => (
              <div
                className={cn(
                  "rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/80",
                  index === events.slice(-5).length - 1 ? "bg-white/10" : "bg-white/5",
                )}
                key={event.id}
              >
                <div className="flex items-start gap-3">
                  {active && index === events.slice(-5).length - 1 ? (
                    <LoaderCircle className="mt-0.5 h-4 w-4 animate-spin text-white/80" />
                  ) : (
                    <TrendingUp className="mt-0.5 h-4 w-4 text-white/60" />
                  )}
                  <div className="min-w-0">
                    <p>{event.message}</p>
                    <p className="mt-1 text-xs text-white/45">
                      {[event.detail, event.source, event.count ? `${event.count} items` : undefined]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ResearchCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-white/66">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function BarStack({ items }: { items: Array<{ label: string; value: number }> }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-3">
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs text-white/52">
              <span className="truncate pr-3">{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-white/8">
              <div
                className="h-2 rounded-full bg-[linear-gradient(90deg,rgba(214,181,255,0.95),rgba(116,202,255,0.95))]"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-white/45">ยังไม่มีข้อมูลเพียงพอ</p>
      )}
    </div>
  );
}

function buildNegativityBins(mentions: MentionItem[]) {
  const bins = [
    { label: "0.00-0.24", value: 0 },
    { label: "0.25-0.49", value: 0 },
    { label: "0.50-0.74", value: 0 },
    { label: "0.75-1.00", value: 0 },
  ];

  for (const mention of mentions) {
    if (mention.negativityScore < 0.25) bins[0].value += 1;
    else if (mention.negativityScore < 0.5) bins[1].value += 1;
    else if (mention.negativityScore < 0.75) bins[2].value += 1;
    else bins[3].value += 1;
  }

  return bins;
}

function buildTimelineBins(mentions: MentionItem[]) {
  const buckets = new Map<string, number>();
  for (const mention of mentions) {
    const date = new Date(mention.publishedAt);
    const label = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    buckets.set(label, (buckets.get(label) ?? 0) + 1);
  }
  return [...buckets.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([label, value]) => ({ label, value }));
}

function buildSourceDistribution(mentions: MentionItem[]) {
  const buckets = new Map<string, number>();
  for (const mention of mentions) {
    buckets.set(mention.source, (buckets.get(mention.source) ?? 0) + 1);
  }
  return [...buckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value }));
}

function mapX(index: number, total: number) {
  if (total <= 1) return 16;
  return 16 + (index / (total - 1)) * 288;
}

function mapY(value: number, points: { x: number; y: number }[]) {
  const max = Math.max(...points.map((point) => point.y), 1);
  return 104 - (value / max) * 88;
}

function buildPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  if (points.length === 1) {
    return `M ${mapX(0, 1)} ${mapY(points[0].y, points)}`;
  }

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${mapX(index, points.length)} ${mapY(point.y, points)}`)
    .join(" ");
}
