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
      className={cn("flex flex-col gap-0.5 group", isAssistant ? "items-start" : "items-end")}
      data-role={message.role}
    >
      {/* Label row ABOVE bubble */}
      <div className={cn("flex items-center gap-2 px-0.5 mb-1", !isAssistant && "flex-row-reverse")}>
        <span className="font-label text-[10px] uppercase tracking-[0.12em] text-[#cbc3d7]">
          {isAssistant ? "OAT" : "YOU"}
        </span>
        {createdAtDate && (
          <span className="font-label text-[9px] text-[#494454]">
            {formatTime(createdAtDate)}
          </span>
        )}
        {streaming && (
          <span className="font-label text-[9px] text-[#d0bcff] animate-pulse">●</span>
        )}
      </div>

      {/* Avatar + bubble row */}
      <div className={cn("flex items-end gap-2", !isAssistant && "flex-row-reverse")}>
        {isAssistant ? (
          <img
            alt="another oat avatar"
            className="h-7 w-7 shrink-0 rounded-full border border-[rgba(208,188,255,0.2)] object-cover mb-1"
            onError={() => setAvatarSrc(assetsConfig.fallbackAvatarPath)}
            src={avatarSrc}
          />
        ) : (
          <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d0bcff] text-[#3c0091]">
            <User2 className="h-3.5 w-3.5" />
          </div>
        )}

        <div
          className={cn(
            "relative max-w-[82%] rounded-xl px-4 py-3 sm:max-w-[75%]",
            isAssistant
              ? "rounded-tl-sm border border-[rgba(208,188,255,0.15)] bg-[rgba(255,255,255,0.07)] backdrop-blur-[24px] shadow-[0_8px_32px_rgba(139,92,246,0.1)]"
              : "rounded-tr-sm bg-[#d0bcff] shadow-[0_4px_20px_rgba(208,188,255,0.2)]",
          )}
        >
          <p
            className={cn(
              "whitespace-pre-wrap text-[15px] leading-7 font-normal",
              isAssistant ? "text-[#cbc3d7]" : "text-[#23005c]",
            )}
          >
            {message.content}
          </p>
          {streaming && (
            <div className="mt-2 inline-flex items-center gap-2 font-label text-[10px] text-[#958ea0]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d0bcff]" />
              กำลังพิมพ์...
            </div>
          )}
        </div>
      </div>

      {/* Copy button below bubble */}
      <button
        className={cn(
          "mt-0.5 px-0.5 opacity-0 transition-opacity group-hover:opacity-100",
          isAssistant ? "self-start ml-9" : "self-end",
          isAssistant ? "text-[#494454] hover:text-[#958ea0]" : "text-[rgba(60,0,145,0.4)] hover:text-[rgba(60,0,145,0.7)]",
        )}
        onClick={handleCopy}
        type="button"
        aria-label="Copy message"
      >
        {copied ? (
          <span className="font-label text-[9px]">copied</span>
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </button>
    </article>
  );
}
