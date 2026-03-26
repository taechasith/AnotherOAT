import { AppShell } from "@/components/app-shell";
import { ClientChat } from "@/components/client-chat";
import { chatSeed } from "@/src/mock/chat-seed";
import { startSession } from "@/src/lib/session/session-service";

export default async function ChatPage() {
  const session = await startSession();

  return (
    <AppShell eyebrow="บทสนทนาหลัก">
      <main className="mt-10 lg:mt-14">
        <ClientChat initialMessages={[...chatSeed]} initialSession={session} />
      </main>
    </AppShell>
  );
}
