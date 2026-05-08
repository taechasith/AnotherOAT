"use client";

import { useMemo, useState, useTransition } from "react";
import { Archive, RefreshCcw } from "lucide-react";

import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import {
  getAgeAtYear,
  getDefaultDataRange,
  getValidYears,
  isAlive,
} from "@/src/lib/persona-lifecycle";
import type { SessionStartOptions, SessionState } from "@/src/lib/types";

export function AnalysisDashboardClient({ initialSession }: { initialSession: SessionState }) {
  const alive = isAlive();
  const defaultRange = getDefaultDataRange();
  const yearOptions = useMemo(() => getValidYears(), []);

  const [session, setSession] = useState(initialSession);
  const [startYear, setStartYear] = useState<number>(defaultRange.startYear);
  const [endYear, setEndYear] = useState<number>(defaultRange.endYear);
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
          body: JSON.stringify({ forceRefresh: true, options }),
        });

        if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลได้ กรุณาลองอีกครั้ง");

        const payload = (await response.json()) as { session: SessionState };
        setSession(payload.session);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "เกิดข้อผิดพลาด");
      }
    });
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {!alive && (
        <Panel className="flex items-center gap-3 p-4 sm:p-5 border-[rgba(208,188,255,0.2)]">
          <Archive className="h-4 w-4 shrink-0 text-[#d0bcff]" />
          <p className="text-sm text-[#cbc3d7]">
            คลังข้อมูลเก็บรักษา — ข้อมูลทั้งหมดสิ้นสุด ณ วันที่โอ๊ตจากไป ไม่มีการดึงข้อมูลใหม่
          </p>
        </Panel>
      )}

      <Panel className="p-4 sm:p-5 md:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1.5 text-xs text-white/68 sm:space-y-2 sm:text-sm">
              <span>From Year</span>
              <select
                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-hidden sm:rounded-2xl sm:px-4 sm:py-3 disabled:opacity-50"
                disabled={!alive && yearOptions.length === 0}
                onChange={(e) => setStartYear(Number(e.target.value))}
                value={startYear}
              >
                {yearOptions.map((year) => (
                  <option className="bg-slate-900" key={year} value={year}>
                    {year} · อายุ {getAgeAtYear(year)}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5 text-xs text-white/68 sm:space-y-2 sm:text-sm">
              <span>To Year</span>
              <select
                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-hidden sm:rounded-2xl sm:px-4 sm:py-3 disabled:opacity-50"
                disabled={!alive && yearOptions.length === 0}
                onChange={(e) => setEndYear(Number(e.target.value))}
                value={endYear}
              >
                {yearOptions.map((year) => (
                  <option className="bg-slate-900" key={year} value={year}>
                    {year} · อายุ {getAgeAtYear(year)}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5 text-xs text-white/68 sm:space-y-2 sm:text-sm">
              <span>Max Items</span>
              <select
                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-white outline-hidden sm:rounded-2xl sm:px-4 sm:py-3"
                onChange={(e) => setMaxItems(Number(e.target.value))}
                value={maxItems}
              >
                {[10, 20, 40, 60, 80].map((n) => (
                  <option className="bg-slate-900" key={n} value={n}>
                    {n} items
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              disabled={!alive || isPending}
              onClick={refreshAnalysis}
              type="button"
              variant="ghost"
            >
              <RefreshCcw className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">
                {isPending ? "Loading..." : alive ? "Refresh Data" : "Archive Mode"}
              </span>
            </Button>
          </div>
        </div>

        <p className="mt-3 text-[10px] leading-5 text-white/45 sm:mt-4 sm:text-xs sm:leading-6">
          {alive
            ? "เลือกช่วงปีและจำนวนรายการ แล้วกด Refresh Data เพื่อโหลดข้อมูลใหม่ตามเงื่อนไขที่กำหนด"
            : "ข้อมูลในคลังสิ้นสุดแล้ว สามารถกรองตามช่วงปีได้แต่ไม่สามารถดึงข้อมูลใหม่ได้"}
        </p>
        {error ? <p className="mt-2 text-xs text-amber-200 sm:mt-3 sm:text-sm">{error}</p> : null}
      </Panel>

      <AnalysisDashboard session={session} />
    </div>
  );
}
