import {
  AlertTriangle,
  BarChart3,
  Database,
  LineChart,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { ScrollReveal, StaggerItem, StaggerList } from "@/components/motion-wrapper";
import { Panel } from "@/components/ui/panel";
import { siteConfig } from "@/src/config/site";
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
            <p className="font-label text-[11px] uppercase tracking-[0.12em] text-[#958ea0]">
              Internet Data Analysis
            </p>
            <h1 className="font-display font-bold text-2xl text-[#e8dff5] mt-2 sm:text-3xl">
              วิเคราะห์ข้อมูลและสัญญาณจากอินเทอร์เน็ต
            </h1>
            <p className="text-sm leading-7 text-[#cbc3d7] mt-3 max-w-3xl">
              ดูว่ามีข้อมูลอะไรเกี่ยวกับโอตบ้าง มากแค่ไหน กระจุกอยู่ในช่วงอายุใด
              และถูกจำแนกเป็นคำวิจารณ์ที่ยุติธรรม การโจมตี ข่าวลือ หรือสัญญาณการเติบโตอย่างไร
            </p>
          </div>
          <div className="rounded-xl border border-[rgba(208,188,255,0.1)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 font-label text-[11px] text-[#958ea0]">
            Last updated {formatDateLabel(session.fetchedAt)}
          </div>
        </div>
      </Panel>

      <StaggerList className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StaggerItem><Metric icon={Database} label="Total items" value={`${mentions.length}`} /></StaggerItem>
        <StaggerItem><Metric icon={BarChart3} label="Average negativity" value={avgNegativity.toFixed(2)} /></StaggerItem>
        <StaggerItem>
          <Metric
            icon={Sparkles}
            label="Providers enabled"
            value={`${sourcesConfig.providerList.filter((item) => item.enabled).length}`}
          />
        </StaggerItem>
        <StaggerItem>
          <Metric
            icon={LineChart}
            label="Mind state"
            value={emotionLabel(session.mindState.emotionalWeight)}
          />
        </StaggerItem>
      </StaggerList>

      <ScrollReveal>
        <section className="grid gap-4 xl:grid-cols-3">
          <ChartCard title="Negativity distribution">
            <BarRows rows={buildNegativityBins(mentions)} />
          </ChartCard>
          <ChartCard title="Timeline density by age">
            <BarRows rows={buildTimelineBins(mentions)} />
          </ChartCard>
          <ChartCard title="Source distribution">
            <BarRows rows={buildSourceDistribution(mentions)} />
          </ChartCard>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.06}>
        <section className="grid gap-4 xl:grid-cols-2">
          <SignalCard
            icon={Sparkles}
            title="Valid criticism"
            items={session.mindState.fairCriticism}
            empty="No significant criticism identified"
          />
          <SignalCard
            icon={ShieldAlert}
            title="Invalid attacks"
            items={session.mindState.unfairAttacks}
            empty="No notable attacks detected"
          />
          <SignalCard
            icon={AlertTriangle}
            title="Unclear rumors"
            items={session.mindState.rumors}
            empty="No circulating rumors found"
          />
          <SignalCard
            icon={LineChart}
            title="Growth signals"
            items={session.mindState.growthSignals}
            empty="No prominent growth signals yet"
          />
        </section>
      </ScrollReveal>

      <Panel className="overflow-hidden">
        <div className="border-b border-[rgba(208,188,255,0.08)] px-5 py-4 sm:px-6">
          <p className="font-label text-[11px] uppercase tracking-[0.12em] text-[#958ea0]">Raw items</p>
          <h2 className="mt-1 text-lg text-[#e8dff5]">Data Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[rgba(255,255,255,0.03)] font-label text-[10px] text-[#958ea0] uppercase tracking-[0.1em]">
              <tr>
                <th className="px-5 py-3 font-medium sm:px-6">Source</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Age</th>
                <th className="px-5 py-3 font-medium">Negativity</th>
                <th className="px-5 py-3 font-medium">Tags</th>
              </tr>
            </thead>
            <tbody>
              {mentions.map((mention) => (
                <tr className="border-t border-[rgba(208,188,255,0.08)] align-top" key={mention.id}>
                  <td className="px-5 py-4 text-[#958ea0] sm:px-6">{mention.source}</td>
                  <td className="px-5 py-4 text-[#e8dff5]">
                    <a className="hover:underline" href={mention.url} rel="noreferrer" target="_blank">
                      {mention.title}
                    </a>
                    <p className="mt-1 max-w-2xl text-xs leading-6 text-[#494454]">{mention.snippet}</p>
                  </td>
                  <td className="px-5 py-4 text-[#958ea0]">{formatDateLabel(mention.publishedAt)}</td>
                  <td className="px-5 py-4 text-[#958ea0]">{formatAgeLabel(mention.publishedAt)}</td>
                  <td className="px-5 py-4 text-[#cbc3d7]">{mention.negativityScore.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {mention.tags.map((tag) => (
                        <span
                          className="rounded-full border border-[rgba(208,188,255,0.12)] bg-[rgba(208,188,255,0.04)] px-2.5 py-1 font-label text-[10px] text-[#cbc3d7]"
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(208,188,255,0.15)] bg-[rgba(208,188,255,0.06)] text-[#d0bcff]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="font-label text-[10px] uppercase tracking-[0.12em] text-[#958ea0]">{label}</p>
          <p className="mt-1 text-xl font-bold text-[#e8dff5]">{value}</p>
        </div>
      </div>
    </Panel>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Panel className="p-5 sm:p-6">
      <p className="font-label text-[11px] uppercase tracking-[0.12em] text-[#958ea0]">{title}</p>
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
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(208,188,255,0.15)] bg-[rgba(208,188,255,0.06)] text-[#d0bcff]">
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-[#e8dff5] text-base font-semibold">{title}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <span
              className="rounded-full border border-[rgba(208,188,255,0.15)] bg-[rgba(208,188,255,0.05)] px-3 py-1.5 font-label text-[11px] text-[#cbc3d7]"
              key={item}
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-[#958ea0]">{empty}</span>
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
          <div className="mb-1 flex items-center justify-between gap-3">
            <span className="font-label text-[10px] text-[#958ea0] truncate pr-3">{row.label}</span>
            <span className="font-label text-[10px] text-[#958ea0]">{row.value}</span>
          </div>
          <div className="h-2 rounded-full bg-[rgba(255,255,255,0.06)]">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[#d0bcff] to-[#9587cc]"
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
  const buckets = new Map<number, number>();
  const birthYear = new Date(siteConfig.birthDate).getUTCFullYear();

  for (const mention of mentions) {
    const year = new Date(mention.publishedAt).getUTCFullYear();
    if (Number.isNaN(year)) continue;
    buckets.set(year, (buckets.get(year) ?? 0) + 1);
  }

  return [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .slice(-10)
    .map(([year, value]) => ({
      label: `อายุ ${year - birthYear} · ${year}`,
      value,
    }));
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

function formatAgeLabel(dateString: string) {
  const year = new Date(dateString).getUTCFullYear();
  const birthYear = new Date(siteConfig.birthDate).getUTCFullYear();
  return `อายุ ${year - birthYear}`;
}

function emotionLabel(value: SessionState["mindState"]["emotionalWeight"]) {
  if (value === "heavy") return "heavy";
  if (value === "moderate") return "moderate";
  return "light";
}
