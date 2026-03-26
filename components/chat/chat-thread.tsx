"use client";

import { useEffect, useRef } from "react";
import { MessageSquareText } from "lucide-react";

import { ChatMessageItem } from "@/components/chat/chat-message-item";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { personaConfig } from "@/src/config/persona";
import type { ChatMessage } from "@/src/lib/types";

export function ChatThread({
  messages,
  streamingMessage,
  onPromptSelect,
}: {
  messages: ChatMessage[];
  streamingMessage?: ChatMessage | null;
  onPromptSelect: (prompt: string) => void;
}) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, streamingMessage]);

  const isEmpty = messages.length === 0 && !streamingMessage;

  return (
    <Panel className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Conversation</p>
            <h2 className="mt-1 text-lg text-white">ห้องสนทนาหลัก</h2>
          </div>
          <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45">
            เลื่อนตามบทสนทนาแบบปลอดภัย
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] px-3 py-4 sm:px-5 sm:py-5">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-white/12 bg-black/10 px-5 py-10 text-center dark:bg-black/20">
            <MessageSquareText className="h-10 w-10 text-white/50" />
            <h3 className="mt-4 font-serif text-2xl text-white">เริ่มด้วยคำถามที่ยังค้างอยู่ในใจ</h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/62">
              คุณอาจถามถึงสิ่งที่ยังเจ็บ คำวิจารณ์ที่แฟร์ หรือเรื่องที่คนยังเข้าใจผิดอยู่ก็ได้
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {personaConfig.starterPrompts.map((prompt) => (
                <Button
                  className="h-auto rounded-full px-4 py-2 text-sm"
                  key={prompt}
                  onClick={() => onPromptSelect(prompt)}
                  type="button"
                  variant="ghost"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <ChatMessageItem key={message.id} message={message} />
            ))}
            {streamingMessage ? <ChatMessageItem message={streamingMessage} streaming /> : null}
            <div ref={endRef} />
          </div>
        )}
      </div>
    </Panel>
  );
}
