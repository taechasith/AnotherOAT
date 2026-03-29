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
      <Panel className="shrink-0 p-3 sm:p-4 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-xs">Workspace</p>
            <h2 className="mt-1 text-sm text-white sm:text-base md:text-lg">Tools &amp; Export</h2>
            <p className="mt-1.5 text-xs leading-5 text-white/60 sm:mt-2 sm:text-sm sm:leading-6">
              Your conversation is saved locally in this browser.
            </p>
          </div>
          <Button className="w-full sm:w-auto shrink-0 min-h-[44px]" onClick={exportReflection} type="button" variant="ghost">
            <Download className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Export</span>
          </Button>
        </div>
      </Panel>

      <InsightPanel mindState={session.mindState} />
    </>
  );

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden sm:gap-4 lg:gap-5">
      <div className="shrink-0 space-y-2 sm:space-y-3 md:space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <ChatHeader isRefreshing={isRefreshing} onRefresh={refreshSession} session={session} />
          </div>
          <Button
            className="lg:hidden shrink-0 min-w-[44px] min-h-[44px]"
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

      <div className="grid min-h-0 flex-1 gap-3 overflow-hidden sm:gap-4 lg:gap-5 lg:grid-cols-[minmax(0,1.15fr)_320px] xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <div className="flex min-h-0 flex-col gap-3 overflow-hidden sm:gap-4">
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

        <div className="hidden min-h-0 flex-col gap-3 overflow-y-auto sm:gap-4 lg:flex">
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
          <div className="fixed bottom-0 left-0 right-0 top-0 z-50 w-full max-w-none animate-in slide-in-from-bottom duration-300 lg:hidden">
            <div className="flex h-full flex-col bg-[#0a0a10] border-t border-white/10 lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between border-b border-white/10 p-3 sm:p-4">
                <h2 className="text-base text-white sm:text-lg">Insights</h2>
                <Button onClick={() => setSidebarOpen(false)} type="button" variant="ghost" className="min-w-[44px] min-h-[44px]" aria-label="Close menu">
                  ✕
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 sm:p-4">{sidePanel}</div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
