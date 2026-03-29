import { AppShell } from "@/components/app-shell";
import { MotionWrapper } from "@/components/motion-wrapper";
import { personaConfig } from "@/src/config/persona";
import { getPersonaDossier } from "@/src/lib/chat/persona-profile";
import { startSession } from "@/src/lib/session/session-service";

export default async function TimelinePage() {
  const session = await startSession();
  const dossier = await getPersonaDossier();
  const beliefs = dossier.goals.length > 0 ? dossier.goals : personaConfig.neutralBeliefs;

  return (
    <AppShell eyebrow="Reflection Timeline">
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        <MotionWrapper className="rounded-[2.25rem] border border-white/10 bg-white/[0.055] p-4 shadow-glow backdrop-blur-xl sm:p-6 md:p-10">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 sm:text-xs">Timeline</p>
          <h1 className="mt-1.5 font-serif text-2xl text-white sm:text-3xl md:text-4xl">
            สิ่งที่เจ็บ สิ่งที่เปลี่ยน และสิ่งที่ฉันเชื่อวันนี้
          </h1>
          <div className="mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TimelineCard
              entries={session.mindState.unfairAttacks}
              title="สิ่งที่ทำให้เจ็บ"
              tone="บางเสียงไม่เคยตั้งใจจะช่วย แต่มันทิ้งรอยไว้จริง"
            />
            <TimelineCard
              entries={session.mindState.growthSignals}
              title="สิ่งที่เปลี่ยนไป"
              tone="การเติบโตเริ่มชัดขึ้นเมื่อการทบทวนมีพื้นที่มากกว่าปฏิกิริยาฉับพลัน"
            />
            <TimelineCard
              entries={beliefs}
              title="สิ่งที่ฉันเชื่อวันนี้"
              tone="มุมมองและเป้าหมายที่ยังยึดถือ ซึ่งปรับเปลี่ยนตามประสบการณ์ที่สะสม"
            />
          </div>
        </MotionWrapper>
      </div>
    </AppShell>
  );
}

function TimelineCard({
  title,
  tone,
  entries,
}: {
  title: string;
  tone: string;
  entries: readonly string[];
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/10 p-4 dark:bg-black/20 sm:rounded-[1.75rem] sm:p-5">
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">{title}</p>
      <p className="mt-2 text-xs leading-6 text-white/62 sm:text-sm">{tone}</p>
      <div className="mt-4 space-y-1.5 sm:space-y-2">
        {entries.map((entry) => (
          <div
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/78 sm:rounded-2xl sm:px-4 sm:py-3"
            key={entry}
          >
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
}
