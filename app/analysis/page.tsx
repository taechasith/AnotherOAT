import { AnalysisDashboardClient } from "@/components/analysis-dashboard-client";
import { AppShell } from "@/components/app-shell";
import { getResolvedAssets } from "@/src/lib/assets";
import { getPreviewSession } from "@/src/lib/preview-session";

export default function AnalysisPage() {
  const session = getPreviewSession();
  const assets = getResolvedAssets();

  return (
    <AppShell assets={assets} eyebrow="Data Analysis">
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        <AnalysisDashboardClient initialSession={session} />
      </div>
    </AppShell>
  );
}
