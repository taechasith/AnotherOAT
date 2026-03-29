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
  const minYear = birthYear + 22;
  const yearOptions = useMemo(
    () =>
      Array.from({ length: currentYear - minYear + 1 }, (_, index) => currentYear - index),
    [minYear, currentYear],
  );

  const [session, setSession] = useState(initialSession);
  const [startYear, setStartYear] = useState<number>(Math.max(minYear, currentYear - 6));
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
          throw new Error("ไม่สามารถโหลดข้อมูลได้ กรุณาลองอีกครั้ง");
        }

        const payload = (await response.json()) as { session: SessionState };
        setSession(payload.session);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "เกิดข้อผิดพลาด");
      }
    });
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <Panel className="p-4 sm:p-5 md:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1.5 text-xs text-white/68 sm:space-y-2 sm:text-sm">
              <span>From Year</span>
              <select
                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-hidden sm:rounded-2xl sm:px-4 sm:py-3"
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

            <label className="space-y-1.5 text-xs text-white/68 sm:space-y-2 sm:text-sm">
              <span>To Year</span>
              <select
                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-hidden sm:rounded-2xl sm:px-4 sm:py-3"
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

            <label className="space-y-1.5 text-xs text-white/68 sm:space-y-2 sm:text-sm">
              <span>Max Items</span>
              <select
                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-hidden sm:rounded-2xl sm:px-4 sm:py-3"
                onChange={(event) => setMaxItems(Number(event.target.value))}
                value={maxItems}
              >
                {SIZE_OPTIONS.map((option) => (
                  <option className="bg-slate-900" key={option} value={option}>
                    {option} items
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button onClick={refreshAnalysis} type="button" variant="ghost">
              <RefreshCcw className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">{isPending ? "Loading..." : "Refresh Data"}</span>
            </Button>
          </div>
        </div>

        <p className="mt-3 text-[10px] leading-5 text-white/45 sm:mt-4 sm:text-xs sm:leading-6">
          เลือกช่วงปีและจำนวนรายการ แล้วกด Refresh Data เพื่อโหลดข้อมูลใหม่ตามเงื่อนไขที่กำหนด
        </p>
        {error ? <p className="mt-2 text-xs text-amber-200 sm:mt-3 sm:text-sm">{error}</p> : null}
      </Panel>

      <AnalysisDashboard session={session} />
    </div>
  );
}
