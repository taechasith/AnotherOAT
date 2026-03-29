import { Panel } from "@/components/ui/panel";
import { sourcesConfig } from "@/src/config/sources";
import type { SessionState } from "@/src/lib/types";

export function LandingEvidenceStrip({ session }: { session: SessionState }) {
  const liveProviders = sourcesConfig.providerList.filter((item) => item.enabled);

  return (
    <section className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <Panel className="p-4 sm:p-5 md:p-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">Session Overview</p>
        <h2 className="mt-1.5 font-serif text-lg text-white sm:text-xl md:text-2xl">ข้อมูลที่เก็บได้ ถูกจำแนก และพร้อมสำหรับการสนทนา</h2>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-white/64 sm:text-sm sm:leading-6">
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
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">Data Sources</p>
        <div className="mt-3 space-y-2 sm:space-y-3">
          {sourcesConfig.providerList.map((provider) => (
            <div
              className="flex items-center justify-between rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-xs dark:bg-black/25 sm:rounded-2xl sm:py-2.5 sm:text-sm"
              key={provider.id}
            >
              <div>
                <p className="text-white/82">{provider.label}</p>
                <p className="text-[10px] text-white/45 sm:text-xs">{provider.type === "remote" ? "External source" : "Local fallback"}</p>
              </div>
              <span
                className={
                  provider.enabled
                    ? "rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-100 sm:text-xs"
                    : "rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-50 sm:text-xs"
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
    <div className="rounded-xl border border-white/10 bg-black/15 p-3 dark:bg-black/25 sm:rounded-2xl sm:p-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/42 sm:text-xs">{label}</p>
      <p className="mt-1.5 text-sm text-white sm:text-base sm:mt-2">{value}</p>
    </div>
  );
}
