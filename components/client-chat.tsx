"use client";

import { Download, Sparkles } from "lucide-react";

import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatStatusBanner } from "@/components/chat/chat-status-banner";
import { ChatThread } from "@/components/chat/chat-thread";
import { InsightPanel } from "@/components/chat/insight-panel";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/src/config/site";
import { useChatSession } from "@/src/lib/chat/use-chat-session";
import { useT } from "@/src/lib/i18n";
import { formatDateLabel } from "@/src/lib/utils";
import type { ChatMessage, SessionState } from "@/src/lib/types";

type ClientChatProps = {
  initialMessages: ChatMessage[];
  initialSession: SessionState;
};

export function ClientChat({ initialMessages, initialSession }: ClientChatProps) {
  const t = useT();
  const {
    banner,
    input,
    isRefreshing,
    messages,
    refreshSession,
    sendMessage,
    session,
    setInput,
    streamingMessage,
  } = useChatSession({ initialMessages, initialSession });

  function exportReflection() {
    const allMessages = streamingMessage ? [...messages, streamingMessage] : messages;
    const body = allMessages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = siteConfig.exportFileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row lg:gap-6">
      {/* ── Main chat column ── */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ChatStatusBanner state={banner} />

        <ChatThread
          messages={messages}
          onPromptSelect={(prompt) => void sendMessage(prompt)}
          streamingMessage={streamingMessage}
        />

        <ChatComposer
          disabled={isRefreshing}
          isStreaming={Boolean(streamingMessage)}
          onChange={setInput}
          onRetry={
            messages.at(-1)?.role === "user"
              ? () => void sendMessage(messages.at(-1)?.content)
              : undefined
          }
          onSubmit={() => void sendMessage()}
          value={input}
        />
      </div>

      {/* ── Desktop insight sidebar ── */}
      <aside className="hidden lg:flex lg:w-72 xl:w-80 shrink-0 flex-col gap-3 overflow-y-auto pb-4 [scrollbar-width:thin] [scrollbar-color:rgba(208,188,255,0.15)_transparent]">
        <div className="rounded-xl border border-[rgba(208,188,255,0.12)] bg-[rgba(255,255,255,0.04)] p-4 space-y-3 shrink-0">
          <div>
            <p className="font-label text-[9px] uppercase tracking-[0.18em] text-[#494454]">{t.sidebar.session}</p>
            <p className="mt-1 text-[13px] text-[#cbc3d7] leading-5">
              {formatDateLabel(session.fetchedAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1 text-[12px] h-9"
              disabled={isRefreshing}
              onClick={() => void refreshSession()}
              type="button"
              variant="ghost"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              {isRefreshing ? t.sidebar.refreshing : t.sidebar.refreshSignals}
            </Button>
            <Button
              className="h-9 w-9 p-0 shrink-0"
              onClick={exportReflection}
              type="button"
              variant="ghost"
              aria-label="Export"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <InsightPanel mindState={session.mindState} />
      </aside>
    </section>
  );
}
