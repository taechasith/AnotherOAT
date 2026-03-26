import { AnalysisDashboardClient } from "@/components/analysis-dashboard-client";
import { AppShell } from "@/components/app-shell";
import { startSession } from "@/src/lib/session/session-service";

export default async function AnalysisPage() {
  const session = await startSession(false, undefined, {
    maxItems: 40,
    rangeDays: 365,
  });

  return (
    <AppShell eyebrow="Internet data analysis">
      <main className="mt-8 space-y-5 lg:mt-10">
        <AnalysisDashboardClient initialSession={session} />
      </main>
    </AppShell>
  );
}
