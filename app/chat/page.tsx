import { AppShell } from "@/components/app-shell";
import { ClientChat } from "@/components/client-chat";
import { getResolvedAssets } from "@/src/lib/assets";
import { getPreviewSession } from "@/src/lib/preview-session";

export default function ChatPage() {
  const session = getPreviewSession();
  const assets = getResolvedAssets();

  return (
    <AppShell assets={assets} viewportLocked>
      <ClientChat initialMessages={[]} initialSession={session} />
    </AppShell>
  );
}
