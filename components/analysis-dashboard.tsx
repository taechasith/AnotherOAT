import { AlertTriangle, BarChart3, Database, LineChart, ShieldAlert, Sparkles } from "lucide-react";

import { Panel } from "@/components/ui/panel";
import { sourcesConfig } from "@/src/config/sources";
import { formatDateLabel } from "@/src/lib/utils";
import type { MentionItem, SessionState } from "@/src/lib/types";

export function AnalysisDashboard({ session }: { session: SessionState }) {
  const mentions = session.mentions;
  const avgNegativity =
    mentions.reduce((sum, item) => sum + item.negativityScore, 0) / Math.max(mentions.length, 1);

  return (
    <div className="space-y-5">
      <Panel className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Internet Data Analysis</p>
            <h1 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
              หน้าแยกสำหรับดู dataset และสัญญาณวิเคราะห์จากอินเทอร์เน็ต
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/64">
              ใช้ดูว่าระบบดึงข้อมูลอะไรเข้ามา จำนวนเท่าไร กระจุกอยู่ช่วงเวลาไหน มีน้ำหนักเชิงลบแค่ไหน
              และสรุปออกมาเป็น valid criticism, invalid attacks, rumors, และ growth signals อย่างไร
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-white/62 dark:bg-black/25">
            dataset ล่าสุด {formatDateLabel(session.fetchedAt)}
          </div>
        </div>
      </Panel>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Database} label="Items in dataset" value={`${mentions.length}`} />
        <Metric icon={BarChart3} label="Average negativity" value={avgNegativity.toFixed(2)} />
        <Metric icon={Sparkles} label="Providers enabled" value={`${sourcesConfig.providerList.filter((item) => item.enabled).length}`} />
        <Metric icon={LineChart} label="Mind state" value={emotionLabel(session.mindState.emotionalWeight)} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Negativity distribution">
          <BarRows rows={buildNegativityBins(mentions)} />
        </ChartCard>
        <ChartCard title="Timeline density">
          <BarRows rows={buildTimelineBins(mentions)} />
        </ChartCard>
        <ChartCard title="Source distribution">
          <BarRows rows={buildSourceDistribution(mentions)} />
        </ChartCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <SignalCard
          icon={Sparkles}
          title="Valid criticism"
          items={session.mindState.fairCriticism}
          empty="ยังไม่มี valid criticism เด่นพอ"
        />
        <SignalCard
          icon={ShieldAlert}
          title="Invalid attacks"
          items={session.mindState.unfairAttacks}
          empty="ยังไม่พบ invalid attacks ที่เด่นชัด"
        />
        <SignalCard
          icon={AlertTriangle}
          title="Unclear rumors"
          items={session.mindState.rumors}
          empty="ยังไม่มี rumor cluster ที่เด่นชัด"
        />
        <SignalCard
          icon={LineChart}
          title="Growth signals"
          items={session.mindState.growthSignals}
          empty="ยังไม่พบ growth signal มากพอ"
        />
      </section>

      <Panel className="overflow-hidden">
        <div className="border-b border-white/10 px-5 py-4 sm:px-6">
          <p className="text-xs uppercase tracking-[0.22em] text-white/45">Raw items</p>
          <h2 className="mt-1 text-lg text-white">รายการที่ถูกใช้สร้างสภาวะใจรอบล่าสุด</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-white/48">
              <tr>
                <th className="px-5 py-3 font-medium sm:px-6">Source</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Negativity</th>
                <th className="px-5 py-3 font-medium">Tags</th>
              </tr>
            </thead>
            <tbody>
              {mentions.map((mention) => (
                <tr className="border-t border-white/8 align-top" key={mention.id}>
                  <td className="px-5 py-4 text-white/62 sm:px-6">{mention.source}</td>
                  <td className="px-5 py-4 text-white/84">
                    <a className="hover:underline" href={mention.url} rel="noreferrer" target="_blank">
                      {mention.title}
                    </a>
                    <p className="mt-1 max-w-2xl text-xs leading-6 text-white/45">{mention.snippet}</p>
                  </td>
                  <td className="px-5 py-4 text-white/52">{formatDateLabel(mention.publishedAt)}</td>
                  <td className="px-5 py-4 text-white/68">{mention.negativityScore.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {mention.tags.map((tag) => (
                        <span
                          className="rounded-full border border-white/10 bg-black/15 px-2.5 py-1 text-xs text-white/70 dark:bg-black/25"
                          key={`${mention.id}-${tag}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Database;
  label: string;
  value: string;
}) {
  return (
    <Panel className="p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white/74">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/42">{label}</p>
          <p className="mt-1 text-xl text-white">{value}</p>
        </div>
      </div>
    </Panel>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Panel className="p-5 sm:p-6">
      <p className="text-sm text-white/66">{title}</p>
      <div className="mt-4">{children}</div>
    </Panel>
  );
}

function SignalCard({
  icon: Icon,
  title,
  items,
  empty,
}: {
  icon: typeof Sparkles;
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <Panel className="p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white/74">
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-lg text-white">{title}</p>
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
          <span className="text-sm text-white/45">{empty}</span>
        )}
      </div>
    </Panel>
  );
}

function BarRows({ rows }: { rows: Array<{ label: string; value: number }> }) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex items-center justify-between text-xs text-white/48">
            <span className="truncate pr-3">{row.label}</span>
            <span>{row.value}</span>
          </div>
          <div className="h-2 rounded-full bg-white/8">
            <div
              className="h-2 rounded-full bg-[linear-gradient(90deg,rgba(214,181,255,0.95),rgba(116,202,255,0.95))]"
              style={{ width: `${(row.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function buildNegativityBins(mentions: MentionItem[]) {
  const bins = [
    { label: "0.00-0.24", value: 0 },
    { label: "0.25-0.49", value: 0 },
    { label: "0.50-0.74", value: 0 },
    { label: "0.75-1.00", value: 0 },
  ];

  for (const mention of mentions) {
    if (mention.negativityScore < 0.25) bins[0].value += 1;
    else if (mention.negativityScore < 0.5) bins[1].value += 1;
    else if (mention.negativityScore < 0.75) bins[2].value += 1;
    else bins[3].value += 1;
  }
  return bins;
}

function buildTimelineBins(mentions: MentionItem[]) {
  const buckets = new Map<string, number>();
  for (const mention of mentions) {
    const date = new Date(mention.publishedAt);
    const label = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    buckets.set(label, (buckets.get(label) ?? 0) + 1);
  }
  return [...buckets.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-8)
    .map(([label, value]) => ({ label, value }));
}

function buildSourceDistribution(mentions: MentionItem[]) {
  const buckets = new Map<string, number>();
  for (const mention of mentions) {
    buckets.set(mention.source, (buckets.get(mention.source) ?? 0) + 1);
  }
  return [...buckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, value]) => ({ label, value }));
}

function emotionLabel(value: SessionState["mindState"]["emotionalWeight"]) {
  if (value === "heavy") return "heavy";
  if (value === "moderate") return "moderate";
  return "light";
}
