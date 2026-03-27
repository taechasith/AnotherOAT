import { Panel } from "@/components/ui/panel";
import { sourcesConfig } from "@/src/config/sources";
import type { SessionState } from "@/src/lib/types";

export function LandingEvidenceStrip({ session }: { session: SessionState }) {
  const liveProviders = sourcesConfig.providerList.filter((item) => item.enabled);

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr]">
      <Panel className="p-4 sm:p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-white/45">Research framing</p>
        <h2 className="mt-2 font-serif text-xl text-white sm:text-2xl">โครงสร้างที่พร้อมไปต่อเป็นงานวิจัยเชิงสังเกต</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/64">
          หน้าเริ่มต้นถูกลดให้เรียบขึ้น แต่ยังคงชี้ชัดว่า session นี้ดึงข้อมูลแบบ bounded,
          traceable, และแยกหมวดความหมายได้ชัดเจนก่อนเข้าสู่บทสนทนา
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <MetricCard label="Mention set" value={`${session.mentions.length} รายการ`} />
          <MetricCard label="Signal classes" value="6 หมวดวิเคราะห์" />
          <MetricCard label="Fetch mode" value="Realtime on session start" />
        </div>
      </Panel>

      <Panel className="p-4 sm:p-6">
        <p className="text-xs uppercase tracking-[0.22em] text-white/45">Source readiness</p>
        <div className="mt-4 space-y-3">
          {sourcesConfig.providerList.map((provider) => (
            <div
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/15 px-3 py-2.5 text-sm dark:bg-black/25"
              key={provider.id}
            >
              <div>
                <p className="text-white/82">{provider.label}</p>
                <p className="text-xs text-white/45">{provider.type === "remote" ? "external source" : "fallback source"}</p>
              </div>
              <span
                className={
                  provider.enabled
                    ? "rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-100"
                    : "rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-50"
                }
              >
                {provider.enabled ? "active" : provider.id === "x-academic-search" ? "needs X credentials" : "inactive"}
              </span>
            </div>
          ))}
          <p className="text-xs leading-6 text-white/42">
            ตอนนี้ใช้งาน Google News RSS และ fallback local seed ได้ทันที ส่วน X.com
            ถูกเตรียมเป็นแหล่งข้อมูลหลักลำดับถัดไป แต่ต้องใช้ official credentials
            ก่อนจึงจะอ้างว่าเป็นงานวิจัยเชิงวิชาการได้อย่างถูกต้อง
          </p>
        </div>
      </Panel>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 p-4 dark:bg-black/25">
      <p className="text-xs uppercase tracking-[0.22em] text-white/42">{label}</p>
      <p className="mt-2 text-lg text-white">{value}</p>
    </div>
  );
}
