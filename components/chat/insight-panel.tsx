"use client";

import { ChevronRight, HeartPulse, LineChart, ShieldAlert, Sparkles, TriangleAlert } from "lucide-react";

import { Panel } from "@/components/ui/panel";
import { useT } from "@/src/lib/i18n";
import type { MindState } from "@/src/lib/types";

export function InsightPanel({ mindState }: { mindState: MindState }) {
  const t = useT();
  const actions = buildReflectionActions(mindState);

  return (
    <div className="space-y-3">
      <InsightSection
        icon={HeartPulse}
        title={t.insight.emotionalState}
        items={[`${emotionLabel(mindState.emotionalWeight)} — ${mindState.summary}`]}
      />
      <InsightSection
        icon={Sparkles}
        title={t.insight.validCriticism}
        items={mindState.fairCriticism}
        emptyLabel={t.insight.noCriticism}
      />
      <InsightSection
        icon={ShieldAlert}
        title={t.insight.invalidAttacks}
        items={mindState.unfairAttacks}
        emptyLabel={t.insight.noAttacks}
      />
      <InsightSection
        icon={TriangleAlert}
        title={t.insight.unclearRumors}
        items={mindState.rumors}
        emptyLabel={t.insight.noRumors}
      />
      <InsightSection
        icon={LineChart}
        title={t.insight.growthSignals}
        items={mindState.growthSignals}
        emptyLabel={t.insight.noGrowth}
      />
      <InsightSection
        icon={ChevronRight}
        title={t.insight.nextActions}
        items={actions}
      />
    </div>
  );
}

function InsightSection({
  icon: Icon,
  title,
  items,
  emptyLabel,
}: {
  icon: typeof HeartPulse;
  title: string;
  items: string[];
  emptyLabel?: string;
}) {
  const t = useT();
  return (
    <Panel className="p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[rgba(208,188,255,0.15)] bg-[rgba(208,188,255,0.06)] text-[#d0bcff]">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <p className="font-label text-[10px] uppercase tracking-[0.12em] text-[#494454]">{title}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {items.length > 0 ? (
          items.map((item) => (
            <span
              className="rounded-full border border-[rgba(208,188,255,0.12)] bg-[rgba(208,188,255,0.04)] px-2.5 py-1 font-label text-[11px] text-[#cbc3d7] leading-5"
              key={item}
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-[12px] text-[#494454]">{emptyLabel ?? t.insight.noData}</span>
        )}
      </div>
    </Panel>
  );
}

function emotionLabel(weight: MindState["emotionalWeight"]) {
  if (weight === "heavy") return "Emotionally heavy";
  if (weight === "moderate") return "Moderately pressured";
  return "Relatively calm";
}

function buildReflectionActions(mindState: MindState) {
  const actions: string[] = [];
  if (mindState.fairCriticism.length > 0)
    actions.push(`เขียนให้ชัดว่าเรื่องไหนของ ${mindState.fairCriticism[0]} ที่ควรยอมรับจริง`);
  if (mindState.unfairAttacks.length > 0)
    actions.push(`ตั้งขอบเขตกับเสียงที่บิดจาก ${mindState.unfairAttacks[0]}`);
  if (mindState.rumors.length > 0)
    actions.push("หลีกเลี่ยงการตอบข่าวลือเหมือนเป็นข้อเท็จจริง");
  if (mindState.growthSignals.length > 0)
    actions.push(`ทบทวนว่าการเติบโตด้าน ${mindState.growthSignals[0]} เกิดขึ้นจริงอย่างไร`);
  if (actions.length === 0)
    actions.push("เริ่มจากคำถามง่าย ๆ ว่าวันนี้อะไรยังค้างอยู่ในใจ");
  return actions.slice(0, 4);
}
