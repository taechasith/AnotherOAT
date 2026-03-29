import { AppShell } from "@/components/app-shell";
import { ClientChat } from "@/components/client-chat";
import { startSession } from "@/src/lib/session/session-service";

export default async function ChatPage() {
  const session = await startSession();

  return (
    <AppShell eyebrow="Reflection Workspace">
      <div className="flex min-h-0 flex-1 flex-col">
        <ClientChat initialMessages={[]} initialSession={session} />
      </div>
    </AppShell>
  );
}
