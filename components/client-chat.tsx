"use client";

import { Download } from "lucide-react";

import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatStatusBanner } from "@/components/chat/chat-status-banner";
import { ChatThread } from "@/components/chat/chat-thread";
import { InsightPanel } from "@/components/chat/insight-panel";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { siteConfig } from "@/src/config/site";
import { useChatSession } from "@/src/lib/chat/use-chat-session";
import type { ChatMessage, SessionState } from "@/src/lib/types";

type ClientChatProps = {
  initialMessages: ChatMessage[];
  initialSession: SessionState;
};

export function ClientChat({ initialMessages, initialSession }: ClientChatProps) {
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
  } = useChatSession({
    initialMessages,
    initialSession,
  });

  function exportReflection() {
    const allMessages = streamingMessage ? [...messages, streamingMessage] : messages;
    const body = allMessages
      .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
      .join("\n\n");

    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = siteConfig.exportFileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  const sidePanel = (
    <>
      <Panel className="shrink-0 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Session tools</p>
            <h2 className="mt-1 text-lg text-white">การใช้งานและการบันทึก</h2>
            <p className="mt-2 text-sm leading-7 text-white/60">
              ข้อความจะถูกเก็บในเบราว์เซอร์เครื่องนี้ เพื่อให้กลับมาคุยต่อได้อย่างปลอดภัย
            </p>
          </div>
          <Button className="w-full sm:w-auto" onClick={exportReflection} type="button" variant="ghost">
            <Download className="mr-2 h-4 w-4" />
            ส่งออก
          </Button>
        </div>
      </Panel>

      <InsightPanel mindState={session.mindState} />
    </>
  );

  return (
    <section className="flex min-h-0 flex-1 flex-col space-y-4 overflow-hidden">
      <div className="shrink-0 space-y-4">
        <ChatHeader isRefreshing={isRefreshing} onRefresh={refreshSession} session={session} />
        <ChatStatusBanner state={banner} />
      </div>

      <div className="grid min-h-0 flex-1 gap-5 overflow-hidden lg:grid-cols-[minmax(0,1.15fr)_320px] xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <div className="flex min-h-0 flex-col gap-4 overflow-hidden">
          <ChatThread
            messages={messages}
            onPromptSelect={(prompt) => void sendMessage(prompt)}
            streamingMessage={streamingMessage}
          />
          <div className="shrink-0">
            <ChatComposer
              disabled={isRefreshing}
              isStreaming={Boolean(streamingMessage)}
              onChange={setInput}
              onRetry={messages.at(-1)?.role === "user" ? () => void sendMessage(messages.at(-1)?.content) : undefined}
              onSubmit={() => void sendMessage()}
              value={input}
            />
          </div>

          <div className="grid gap-4 lg:hidden">{sidePanel}</div>
        </div>

        <div className="hidden min-h-0 flex-col gap-4 overflow-y-auto lg:flex">
          {sidePanel}
        </div>
      </div>
    </section>
  );
}
