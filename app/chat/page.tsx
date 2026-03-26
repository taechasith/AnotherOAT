import { AppShell } from "@/components/app-shell";
import { ClientChat } from "@/components/client-chat";
import { startSession } from "@/src/lib/session/session-service";

export default async function ChatPage() {
  const session = await startSession();

  return (
    <AppShell eyebrow="Premium reflection workspace" viewportLocked>
      <main className="mt-6 flex min-h-0 flex-1 overflow-hidden lg:mt-8">
        <ClientChat initialMessages={[]} initialSession={session} />
      </main>
    </AppShell>
  );
}
