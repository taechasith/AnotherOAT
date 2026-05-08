import { Panel } from "@/components/ui/panel";
import { sourcesConfig } from "@/src/config/sources";
import type { SessionState } from "@/src/lib/types";

export function LandingEvidenceStrip({ session }: { session: SessionState }) {
  const liveProviders = sourcesConfig.providerList.filter((item) => item.enabled);

  return (
    <section className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <Panel className="p-4 sm:p-5 md:p-6">
        <p className="font-label text-[10px] uppercase tracking-[0.12em] text-[#958ea0]">Session Overview</p>
        <h2 className="font-display font-semibold text-lg text-[#e8dff5] mt-2 sm:text-xl md:text-2xl">ข้อมูลที่เก็บได้ ถูกจำแนก และพร้อมสำหรับการสนทนา</h2>
        <p className="text-sm leading-6 text-[#cbc3d7] mt-2">
          แต่ละเซสชันดึงข้อมูลเกี่ยวกับโอตจากอินเทอร์เน็ต วิเคราะห์โทนเนื้อหา
          และจัดกลุ่มเป็นสัญญาณที่ชัดเจน ก่อนเปิดพื้นที่สนทนา
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
          <MetricCard label="Data points" value={`${session.mentions.length} items`} />
          <MetricCard label="Signal types" value="6 categories" />
          <MetricCard label="Collection mode" value="Live on session start" />
        </div>
      </Panel>

      <Panel className="p-4 sm:p-5 md:p-6">
        <p className="font-label text-[10px] uppercase tracking-[0.12em] text-[#958ea0]">Data Sources</p>
        <div className="mt-3 space-y-2 sm:space-y-3">
          {sourcesConfig.providerList.map((provider) => (
            <div
              className="rounded-xl border border-[rgba(208,188,255,0.1)] bg-[rgba(255,255,255,0.03)] px-3 py-2 sm:py-2.5 flex items-center justify-between"
              key={provider.id}
            >
              <div>
                <p className="text-[#e8dff5] text-sm">{provider.label}</p>
                <p className="font-label text-[10px] text-[#958ea0]">{provider.type === "remote" ? "External source" : "Local fallback"}</p>
              </div>
              <span
                className={
                  provider.enabled
                    ? "rounded-full border border-[rgba(125,211,182,0.3)] bg-[rgba(125,211,182,0.08)] px-2 py-0.5 font-label text-[10px] text-emerald-300"
                    : "rounded-full border border-[rgba(251,191,36,0.3)] bg-[rgba(251,191,36,0.06)] px-2 py-0.5 font-label text-[10px] text-amber-300"
                }
              >
                {provider.enabled ? "Active" : provider.id === "x-academic-search" ? "Needs credentials" : "Inactive"}
              </span>
            </div>
          ))}
          <p className="text-[10px] leading-5 text-white/42 sm:text-xs sm:leading-6">
            Google News RSS และ local seed พร้อมใช้งานทันที
            X.com จะเปิดใช้เมื่อได้รับ credentials ที่ถูกต้อง
          </p>
        </div>
      </Panel>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[rgba(208,188,255,0.12)] bg-[rgba(255,255,255,0.04)] p-3 sm:p-4">
      <p className="font-label text-[10px] uppercase tracking-[0.12em] text-[#958ea0]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#e8dff5] sm:text-base">{value}</p>
    </div>
  );
}
