import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { formatDateLabel } from "@/src/lib/utils";
import type { SessionState } from "@/src/lib/types";

export function ChatHeader({
  session,
  onRefresh,
  isRefreshing,
}: {
  session: SessionState;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  return (
    <Panel className="p-4 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(208,188,255,0.2)] bg-[rgba(208,188,255,0.06)] px-3 py-1 font-label text-[10px] uppercase tracking-[0.12em] text-[#d0bcff]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d0bcff] animate-pulse" />
            Reflection Session
          </div>
          <div className="space-y-2">
            <h1 className="font-display font-bold text-xl text-[#e8dff5] sm:text-2xl lg:text-3xl">
              สนทนากับตัวเองผ่านข้อมูลที่โลกมอบให้
            </h1>
            <p className="text-sm leading-6 text-[#cbc3d7] max-w-3xl">
              พื้นที่นี้ช่วยให้คุณแยกแยะระหว่างคำวิจารณ์ที่มีคุณค่า
              การโจมตีที่ไม่ยุติธรรม และสัญญาณการเติบโตที่ซ่อนอยู่
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
          <div className="rounded-xl border border-[rgba(208,188,255,0.1)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 font-label text-[11px] text-[#958ea0]">
            Updated {formatDateLabel(session.fetchedAt)}
          </div>
          <Button className="w-full sm:w-auto" onClick={onRefresh} type="button" variant="ghost">
            <Sparkles className="mr-2 h-4 w-4" />
            {isRefreshing ? "Refreshing..." : "Refresh Signals"}
          </Button>
        </div>
      </div>
    </Panel>
  );
}
