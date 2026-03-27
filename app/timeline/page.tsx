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
    <AppShell eyebrow="เส้นเวลาการทบทวนตัวเอง">
      <main className="mt-10 space-y-6 lg:mt-14">
        <MotionWrapper className="rounded-4xl border border-white/15 bg-white/8 p-6 shadow-glow backdrop-blur-xl sm:p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-white/50">ไทม์ไลน์</p>
          <h1 className="mt-2 font-serif text-4xl text-white">
            อะไรที่เจ็บ อะไรที่เปลี่ยน และวันนี้ฉันเชื่ออะไร
          </h1>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
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
              tone="บล็อกนี้ดึงจาก persona markdown ก่อน ถ้าไม่มีจึงค่อย fallback เป็นค่า framework กลาง"
            />
          </div>
        </MotionWrapper>
      </main>
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
    <div className="rounded-[1.75rem] border border-white/10 bg-black/10 p-5 dark:bg-black/20">
      <p className="text-xs uppercase tracking-[0.22em] text-white/45">{title}</p>
      <p className="mt-3 text-sm leading-7 text-white/62">{tone}</p>
      <div className="mt-5 space-y-2">
        {entries.map((entry) => (
          <div
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/78"
            key={entry}
          >
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
}
