import {
  AlertTriangle,
  BarChart3,
  Database,
  LineChart,
  ShieldAlert,
  Sparkles,
  Wifi,
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
      {/* Page header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.18em] text-[#494454]">
              Internet Data Analysis
            </p>
            <h1 className="font-display font-bold text-2xl text-[#e8dff5] mt-1 sm:text-3xl">
              Insights
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-[rgba(208,188,255,0.2)] bg-[rgba(208,188,255,0.06)] px-3 py-1.5">
              <Wifi className="h-3 w-3 text-[#d0bcff]" />
              <span className="font-label text-[10px] uppercase tracking-[0.1em] text-[#d0bcff]">Live</span>
            </div>
            <div className="rounded-full border border-[rgba(208,188,255,0.1)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 font-label text-[10px] text-[#494454]">
              {formatDateLabel(session.fetchedAt)}
            </div>
          </div>
        </div>
        <p className="text-sm leading-7 text-[#494454] max-w-2xl">
          ดูว่ามีข้อมูลอะไรเกี่ยวกับโอตบ้าง มากแค่ไหน และถูกจำแนกอย่างไร
        </p>
      </div>

      {/* Metric cards — stacked on mobile, 2-col on sm+ */}
      <StaggerList className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <MetricCard
            icon={Database}
            label="Total items"
            value={`${mentions.length}`}
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            icon={BarChart3}
            label="Average negativity"
            value={avgNegativity.toFixed(2)}
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            icon={Sparkles}
            label="Providers enabled"
            value={`${sourcesConfig.providerList.filter((item) => item.enabled).length}`}
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            icon={LineChart}
            label="Mind state"
            value={emotionLabel(session.mindState.emotionalWeight)}
          />
        </StaggerItem>
      </StaggerList>

      {/* Charts */}
      <ScrollReveal>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ChartCard title="Negativity Distribution">
            <BarRows rows={buildNegativityBins(mentions)} total={mentions.length} />
          </ChartCard>
          <ChartCard title="Timeline Density by Age">
            <BarRows rows={buildTimelineBins(mentions)} total={mentions.length} />
          </ChartCard>
          <ChartCard title="Source Distribution">
            <BarRows rows={buildSourceDistribution(mentions)} total={mentions.length} />
          </ChartCard>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.04}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SignalCard
            icon={Sparkles}
            title="Valid Criticism"
            items={session.mindState.fairCriticism}
            empty="No significant criticism identified"
          />
          <SignalCard
            icon={ShieldAlert}
            title="Invalid Attacks"
            items={session.mindState.unfairAttacks}
            empty="No notable attacks detected"
          />
          <SignalCard
            icon={AlertTriangle}
            title="Unclear Rumors"
            items={session.mindState.rumors}
            empty="No circulating rumors found"
          />
          <SignalCard
            icon={LineChart}
            title="Growth Signals"
            items={session.mindState.growthSignals}
            empty="No prominent growth signals yet"
          />
        </div>
      </ScrollReveal>

      {/* Data Sources */}
      <ScrollReveal delay={0.06}>
        <Panel className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-4 w-4 text-[#d0bcff]" />
            <p className="font-label text-[11px] uppercase tracking-[0.14em] text-[#958ea0]">Data Sources</p>
          </div>
          <div className="space-y-2">
            {sourcesConfig.providerList.map((provider) => (
              <div
                className="flex items-center justify-between py-2.5 border-b border-[rgba(208,188,255,0.06)] last:border-0"
                key={provider.id}
              >
                <span className="text-[13px] text-[#cbc3d7]">{provider.label}</span>
                <span
                  className={`font-label text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full ${
                    provider.enabled
                      ? "text-[#d0bcff] bg-[rgba(208,188,255,0.08)] border border-[rgba(208,188,255,0.2)]"
                      : "text-[#494454] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]"
                  }`}
                >
                  {provider.enabled ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </ScrollReveal>

      {/* Raw records table */}
      <ScrollReveal delay={0.08}>
        <Panel className="overflow-hidden">
          <div className="border-b border-[rgba(208,188,255,0.08)] px-5 py-4 sm:px-6">
            <p className="font-label text-[11px] uppercase tracking-[0.12em] text-[#958ea0]">Raw items</p>
            <h2 className="mt-1 text-base text-[#e8dff5]">Data Records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[rgba(255,255,255,0.03)] font-label text-[10px] text-[#958ea0] uppercase tracking-[0.1em]">
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
                  <tr className="border-t border-[rgba(208,188,255,0.08)] align-top" key={mention.id}>
                    <td className="px-5 py-4 text-[#958ea0] sm:px-6">{mention.source}</td>
                    <td className="px-5 py-4 text-[#e8dff5]">
                      <a className="hover:text-[#d0bcff] transition-colors" href={mention.url} rel="noreferrer" target="_blank">
                        {mention.title}
                      </a>
                      <p className="mt-1 max-w-2xl text-xs leading-6 text-[#494454]">{mention.snippet}</p>
                    </td>
                    <td className="px-5 py-4 text-[#958ea0] whitespace-nowrap">{formatDateLabel(mention.publishedAt)}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`font-label text-[10px] ${
                          mention.negativityScore >= 0.5 ? "text-[#d0bcff]" : "text-[#958ea0]"
                        }`}
                      >
                        {mention.negativityScore.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {mention.tags.map((tag) => (
                          <span
                            className="rounded-full border border-[rgba(208,188,255,0.12)] bg-[rgba(208,188,255,0.04)] px-2 py-0.5 font-label text-[9px] text-[#cbc3d7]"
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
      </ScrollReveal>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Database;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[rgba(208,188,255,0.12)] bg-[rgba(255,255,255,0.04)] p-5 backdrop-blur-[24px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-label text-[10px] uppercase tracking-[0.14em] text-[#494454]">{label}</p>
          <p className="mt-2 text-3xl font-bold text-[#e8dff5] leading-none">{value}</p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[rgba(208,188,255,0.15)] bg-[rgba(208,188,255,0.06)] text-[#d0bcff]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {/* Lavender accent bar */}
      <div className="mt-4 h-0.5 w-full rounded-full bg-[rgba(208,188,255,0.08)]">
        <div className="h-0.5 w-1/3 rounded-full bg-gradient-to-r from-[#d0bcff] to-transparent" />
      </div>
    </div>
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
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(208,188,255,0.15)] bg-[rgba(208,188,255,0.06)] text-[#d0bcff]">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <p className="font-label text-[10px] uppercase tracking-[0.12em] text-[#958ea0]">{title}</p>
      </div>
      <div className="flex flex-wrap gap-2">
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
          <span className="text-[13px] text-[#494454]">{empty}</span>
        )}
      </div>
    </Panel>
  );
}

function BarRows({
  rows,
  total,
}: {
  rows: Array<{ label: string; value: number }>;
  total: number;
}) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <div className="space-y-3">
      {rows.map((row) => {
        const pct = total > 0 ? Math.round((row.value / total) * 100) : 0;
        return (
          <div key={row.label}>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="font-label text-[10px] text-[#958ea0] truncate pr-2">{row.label}</span>
              <span className="font-label text-[10px] text-[#cbc3d7] shrink-0">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.05)]">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-[#d0bcff] to-[#9587cc]"
                style={{ width: `${(row.value / max) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function buildNegativityBins(mentions: MentionItem[]) {
  const bins = [
    { label: "0.00–0.24", value: 0 },
    { label: "0.25–0.49", value: 0 },
    { label: "0.50–0.74", value: 0 },
    { label: "0.75–1.00", value: 0 },
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
    .slice(-8)
    .map(([year, value]) => ({ label: `อายุ ${year - birthYear} · ${year}`, value }));
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
