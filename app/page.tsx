import { AppShell } from "@/components/app-shell";
import { ChatPreview } from "@/components/chat-preview";
import { HeroCard } from "@/components/hero-card";
import { MemorySignalCard } from "@/components/memory-signal-card";
import { getResolvedAssets } from "@/src/lib/assets";
import { getPreviewSession } from "@/src/lib/preview-session";

export default async function HomePage() {
  const session = getPreviewSession();
  const assets = getResolvedAssets();

  return (
    <AppShell eyebrow="เดโมใช้งานบนเครื่องก่อน">
      <main className="mt-10 space-y-6 lg:mt-14">
        <HeroCard avatar={assets.avatar} />
        <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <ChatPreview />
          <MemorySignalCard session={session} />
        </div>
      </main>
    </AppShell>
  );
}
