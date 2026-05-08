"use client";

import { useState } from "react";
import { Copy, User2 } from "lucide-react";

import { assetsConfig } from "@/src/config/assets";
import { cn } from "@/src/lib/utils";
import type { ChatMessage } from "@/src/lib/types";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

export function ChatMessageItem({
  message,
  streaming = false,
}: {
  message: ChatMessage;
  streaming?: boolean;
}) {
  const [avatarSrc, setAvatarSrc] = useState<string>(assetsConfig.avatarPath);
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";

  const createdAtDate = message.createdAt ? new Date(message.createdAt) : null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article
      className={cn("flex items-end gap-2.5 sm:gap-3 group", isAssistant ? "justify-start" : "justify-end")}
      data-role={message.role}
    >
      {isAssistant ? (
        <div className="mb-1 shrink-0 overflow-hidden">
          <img
            alt="another oat avatar"
            className="h-9 w-9 shrink-0 rounded-full border border-[rgba(208,188,255,0.2)] object-cover"
            onError={() => setAvatarSrc(assetsConfig.fallbackAvatarPath)}
            src={avatarSrc}
          />
        </div>
      ) : null}

      <div
        className={cn(
          "relative max-w-[85%] rounded-xl px-4 py-3 sm:max-w-[72%]",
          isAssistant
            ? "rounded-tl-sm border border-[rgba(208,188,255,0.15)] bg-[rgba(255,255,255,0.07)] backdrop-blur-[24px] shadow-[0_8px_32px_rgba(139,92,246,0.12)]"
            : "rounded-tr-sm bg-[#d0bcff] shadow-[0_4px_20px_rgba(208,188,255,0.2)]",
        )}
      >
        <p className={cn("mb-1.5 font-label text-[10px] uppercase tracking-[0.12em]", isAssistant ? "text-[#958ea0]" : "text-[rgba(60,0,145,0.6)]")}>
          {isAssistant ? "another oat" : "คุณ"}
        </p>
        <p className={cn("whitespace-pre-wrap text-[15px] leading-7 font-normal", isAssistant ? "text-[#cbc3d7]" : "text-[#23005c]")}>{message.content}</p>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          {streaming ? (
            <div className="inline-flex items-center gap-2 font-label text-[10px] text-[#958ea0]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d0bcff]" />
              กำลังพิมพ์...
            </div>
          ) : createdAtDate ? (
            <span className={cn("text-[10px]", isAssistant ? "text-[#494454]" : "text-[rgba(60,0,145,0.45)]")}>
              {formatTime(createdAtDate)}
            </span>
          ) : null}
          <button
            className={cn(
              "opacity-0 transition-opacity group-hover:opacity-100",
              isAssistant ? "text-[#494454] hover:text-[#958ea0]" : "text-[rgba(60,0,145,0.4)] hover:text-[rgba(60,0,145,0.7)]",
            )}
            onClick={handleCopy}
            type="button"
            aria-label="Copy message"
          >
            {copied ? (
              <span className="text-[10px]">copied</span>
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>

      {!isAssistant ? (
        <div className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d0bcff] text-[#3c0091]">
          <User2 className="h-4 w-4" />
        </div>
      ) : null}
    </article>
  );
}
