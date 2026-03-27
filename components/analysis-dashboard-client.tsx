"use client";

import { useMemo, useState, useTransition } from "react";
import { RefreshCcw } from "lucide-react";

import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { siteConfig } from "@/src/config/site";
import type { SessionStartOptions, SessionState } from "@/src/lib/types";

const SIZE_OPTIONS = [10, 20, 40, 60, 80];

export function AnalysisDashboardClient({ initialSession }: { initialSession: SessionState }) {
  const currentYear = new Date().getUTCFullYear();
  const birthYear = new Date(siteConfig.birthDate).getUTCFullYear();
  const yearOptions = useMemo(
    () =>
      Array.from({ length: currentYear - birthYear + 1 }, (_, index) => currentYear - index),
    [birthYear, currentYear],
  );

  const [session, setSession] = useState(initialSession);
  const [startYear, setStartYear] = useState<number>(Math.max(birthYear, currentYear - 6));
  const [endYear, setEndYear] = useState<number>(currentYear);
  const [maxItems, setMaxItems] = useState<number>(40);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function refreshAnalysis() {
    startTransition(async () => {
      setError(null);
      try {
        const options: SessionStartOptions = {
          startYear: Math.min(startYear, endYear),
          endYear: Math.max(startYear, endYear),
          maxItems,
        };

        const response = await fetch("/api/session-start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            forceRefresh: true,
            options,
          }),
        });

        if (!response.ok) {
          throw new Error("โหลด dataset ใหม่ไม่สำเร็จ");
        }

        const payload = (await response.json()) as { session: SessionState };
        setSession(payload.session);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "เกิดข้อผิดพลาด");
      }
    });
  }

  return (
    <div className="space-y-5">
      <Panel className="p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2 text-sm text-white/68">
              <span>เลือกปีเริ่มต้น</span>
              <select
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-hidden"
                onChange={(event) => setStartYear(Number(event.target.value))}
                value={startYear}
              >
                {yearOptions.map((year) => (
                  <option className="bg-slate-900" key={year} value={year}>
                    {year} · อายุ {year - birthYear}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-white/68">
              <span>เลือกปีสิ้นสุด</span>
              <select
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-hidden"
                onChange={(event) => setEndYear(Number(event.target.value))}
                value={endYear}
              >
                {yearOptions.map((year) => (
                  <option className="bg-slate-900" key={year} value={year}>
                    {year} · อายุ {year - birthYear}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm text-white/68">
              <span>เลือกขนาดข้อมูลสูงสุด</span>
              <select
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-hidden"
                onChange={(event) => setMaxItems(Number(event.target.value))}
                value={maxItems}
              >
                {SIZE_OPTIONS.map((option) => (
                  <option className="bg-slate-900" key={option} value={option}>
                    {option} รายการ
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={refreshAnalysis} type="button" variant="ghost">
              <RefreshCcw className="mr-2 h-4 w-4" />
              {isPending ? "กำลังดึงข้อมูล..." : "ดึง dataset ใหม่"}
            </Button>
          </div>
        </div>

        <p className="mt-4 text-xs leading-6 text-white/45">
          ค่านี้จะถูกส่งไปที่ session-start route จริง เพื่อคัดกรองข้อมูลตามปีที่เลือก แล้วแสดง
          timeline ในหน่วยอายุของโอต ปราโมทย
        </p>
        {error ? <p className="mt-3 text-sm text-amber-200">{error}</p> : null}
      </Panel>

      <AnalysisDashboard session={session} />
    </div>
  );
}
