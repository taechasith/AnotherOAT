import { AppShell } from "@/components/app-shell";
import { ClientChat } from "@/components/client-chat";
import { getResolvedAssets } from "@/src/lib/assets";
import { startSession } from "@/src/lib/session/session-service";

export default async function ChatPage() {
  const session = await startSession();
  const assets = getResolvedAssets();

  return (
    <AppShell assets={assets} viewportLocked>
      <ClientChat initialMessages={[]} initialSession={session} />
    </AppShell>
  );
}
