"use client";

import { useState } from "react";
import { Download, PanelLeftClose } from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <Panel className="shrink-0 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Session tools</p>
            <h2 className="mt-1 text-base sm:text-lg text-white">การใช้งานและการบันทึก</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              ข้อความจะถูกเก็บในเบราว์เซอร์เครื่องนี้ เพื่อให้กลับมาคุยต่อได้อย่างปลอดภัย
            </p>
          </div>
          <Button className="w-full sm:w-auto shrink-0" onClick={exportReflection} type="button" variant="ghost">
            <Download className="mr-2 h-4 w-4" />
            ส่งออก
          </Button>
        </div>
      </Panel>

      <InsightPanel mindState={session.mindState} />
    </>
  );

  return (
    <section className="flex min-h-0 flex-1 flex-col space-y-3 overflow-hidden sm:space-y-4">
      <div className="shrink-0 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <ChatHeader isRefreshing={isRefreshing} onRefresh={refreshSession} session={session} />
          </div>
          <Button
            className="lg:hidden shrink-0"
            onClick={() => setSidebarOpen(true)}
            type="button"
            variant="ghost"
            aria-label="Open sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        </div>
        <ChatStatusBanner state={banner} />
      </div>

      <div className="grid min-h-0 flex-1 gap-3 overflow-hidden sm:gap-5 lg:grid-cols-[minmax(0,1.15fr)_320px] xl:grid-cols-[minmax(0,1.35fr)_360px]">
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
        </div>

        <div className="hidden min-h-0 flex-col gap-4 overflow-y-auto lg:flex">
          {sidePanel}
        </div>
      </div>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed bottom-0 right-0 top-0 z-50 w-[300px] max-w-[85vw] animate-in slide-in-from-right duration-300 lg:hidden">
            <div className="flex h-full flex-col bg-[#0a0a10] border-l border-white/10">
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <h2 className="text-lg text-white">เมนู</h2>
                <Button onClick={() => setSidebarOpen(false)} type="button" variant="ghost">
                  ✕
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">{sidePanel}</div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
