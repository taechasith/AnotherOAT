import { MotionWrapper } from "@/components/motion-wrapper";
import { formatDateLabel } from "@/src/lib/utils";
import type { SessionState } from "@/src/lib/types";

export function MemorySignalCard({ session }: { session: SessionState }) {
  return (
    <MotionWrapper
      className="rounded-4xl border border-white/15 bg-white/8 p-6 shadow-glow backdrop-blur-xl"
      delay={0.15}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-white/50">สัญญาณความทรงจำ</p>
          <h2 className="mt-2 font-serif text-2xl text-white">สิ่งที่ใจดวงนี้กำลังแบกอยู่</h2>
        </div>
        <p className="text-sm text-white/50">{formatDateLabel(session.fetchedAt)}</p>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">{session.mindState.summary}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SignalColumn label="คำวิจารณ์ที่ยุติธรรม" items={session.mindState.fairCriticism} />
        <SignalColumn label="การโจมตีที่ไม่ยุติธรรม" items={session.mindState.unfairAttacks} />
        <SignalColumn label="ข่าวลือ / ข้อมูลไม่ชัด" items={session.mindState.rumors} />
        <SignalColumn label="สัญญาณของการเติบโต" items={session.mindState.growthSignals} />
      </div>
    </MotionWrapper>
  );
}

function SignalColumn({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/10 p-4 dark:bg-black/20">
      <p className="text-xs uppercase tracking-[0.22em] text-white/45">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <span
              className="rounded-full border border-white/15 bg-white/7 px-3 py-1 text-sm text-white/80"
              key={item}
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-white/45">ยังไม่มีสัญญาณเด่นชัด</span>
        )}
      </div>
    </div>
  );
}
