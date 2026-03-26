import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { AppShell } from "@/components/app-shell";
import { startSession } from "@/src/lib/session/session-service";

export default async function AnalysisPage() {
  const session = await startSession();

  return (
    <AppShell eyebrow="Internet data analysis">
      <main className="mt-8 space-y-5 lg:mt-10">
        <AnalysisDashboard session={session} />
      </main>
    </AppShell>
  );
}
