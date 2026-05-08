"use client";

import { useEffect, useRef, useState } from "react";

import { ChatMessageItem } from "@/components/chat/chat-message-item";
import { assetsConfig } from "@/src/config/assets";
import { personaConfig } from "@/src/config/persona";
import { useT } from "@/src/lib/i18n";
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
  const [avatarSrc, setAvatarSrc] = useState<string>(assetsConfig.avatarPath);
  const t = useT();

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, streamingMessage]);

  const isEmpty = messages.length === 0 && !streamingMessage;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Avatar + status pill */}
      <div className="shrink-0 flex flex-col items-center gap-3 pt-5 pb-3">
        <div className="relative">
          <img
            alt="OAT avatar"
            className="h-20 w-20 rounded-full border-2 border-[rgba(208,188,255,0.35)] object-cover shadow-[0_0_32px_rgba(208,188,255,0.2)]"
            onError={() => setAvatarSrc(assetsConfig.fallbackAvatarPath)}
            src={avatarSrc}
          />
          <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-[#d0bcff] border-2 border-[#151120] animate-pulse" />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(208,188,255,0.15)] bg-[rgba(208,188,255,0.05)] px-4 py-1.5 font-label text-[10px] uppercase tracking-[0.1em] text-[#958ea0]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d0bcff] animate-pulse" />
          {t.chat.readyPill}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-1 py-2">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center gap-5">
            <p className="text-sm leading-7 text-[#494454] max-w-xs">
              {t.chat.emptyHint}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {personaConfig.defaultStarterPrompts.map((prompt) => (
                <button
                  className="rounded-full border border-[rgba(208,188,255,0.15)] bg-[rgba(255,255,255,0.04)] px-4 py-2 font-label text-[11px] text-[#cbc3d7] hover:bg-[rgba(208,188,255,0.08)] transition-colors"
                  key={prompt}
                  onClick={() => onPromptSelect(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessageItem key={message.id} message={message} />
            ))}
            {streamingMessage ? <ChatMessageItem message={streamingMessage} streaming /> : null}
            <div ref={endRef} />
          </div>
        )}
      </div>
    </div>
  );
}
