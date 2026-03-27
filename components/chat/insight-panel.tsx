import { ChevronRight, HeartPulse, ShieldAlert, Sparkles, TriangleAlert } from "lucide-react";

import { Panel } from "@/components/ui/panel";
import type { MindState } from "@/src/lib/types";

export function InsightPanel({ mindState }: { mindState: MindState }) {
  const actions = buildReflectionActions(mindState);

  return (
    <div className="space-y-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
      <InsightSection
        icon={HeartPulse}
        title="Current emotional state"
        items={[`${emotionLabel(mindState.emotionalWeight)} • ${mindState.summary}`]}
      />
      <InsightSection
        icon={Sparkles}
        title="Valid criticism"
        items={mindState.fairCriticism}
        emptyLabel="ยังไม่มีประเด็นที่แฟร์ชัดพอ"
      />
      <InsightSection
        icon={ShieldAlert}
        title="Invalid attacks"
        items={mindState.unfairAttacks}
        emptyLabel="ยังไม่พบสัญญาณโจมตีเด่นชัด"
      />
      <InsightSection
        icon={TriangleAlert}
        title="Unclear rumors"
        items={mindState.rumors}
        emptyLabel="ยังไม่มีข่าวลือที่เด่นขึ้นมา"
      />
      <InsightSection
        icon={Sparkles}
        title="Growth signals"
        items={mindState.growthSignals}
        emptyLabel="ยังไม่พบสัญญาณการเปลี่ยนแปลงมากพอ"
      />
      <InsightSection
        icon={ChevronRight}
        title="Next reflection actions"
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
  return (
    <Panel className="p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white/72">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/45">{title}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <span
              className="rounded-full border border-white/12 bg-black/15 px-3 py-1.5 text-sm text-white/78 dark:bg-black/25"
              key={item}
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-white/45">{emptyLabel ?? "ยังไม่มีข้อมูล"}</span>
        )}
      </div>
    </Panel>
  );
}

function emotionLabel(weight: MindState["emotionalWeight"]) {
  if (weight === "heavy") return "ภาวะหนัก";
  if (weight === "moderate") return "ภาวะกดทับปานกลาง";
  return "ภาวะค่อนข้างนิ่ง";
}

function buildReflectionActions(mindState: MindState) {
  const actions: string[] = [];

  if (mindState.fairCriticism.length > 0) {
    actions.push(`เขียนให้ชัดว่าเรื่องไหนของ ${mindState.fairCriticism[0]} ที่ควรยอมรับจริง`);
  }
  if (mindState.unfairAttacks.length > 0) {
    actions.push(`ตั้งขอบเขตกับเสียงที่บิดจาก ${mindState.unfairAttacks[0]}`);
  }
  if (mindState.rumors.length > 0) {
    actions.push("หลีกเลี่ยงการตอบข่าวลือเหมือนเป็นข้อเท็จจริง");
  }
  if (mindState.growthSignals.length > 0) {
    actions.push(`ทบทวนว่าการเติบโตด้าน ${mindState.growthSignals[0]} เกิดขึ้นจริงอย่างไร`);
  }
  if (actions.length === 0) {
    actions.push("เริ่มจากคำถามง่าย ๆ ว่าวันนี้อะไรยังค้างอยู่ในใจ");
  }

  return actions.slice(0, 4);
}
