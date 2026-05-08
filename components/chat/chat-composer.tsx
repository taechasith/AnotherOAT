"use client";

import { useRef } from "react";
import { LoaderCircle, Mic, Plus, RotateCcw, SendHorizonal } from "lucide-react";

const QUICK_CHIPS = ["Deep Reflection", "Goal Alignment", "Emotional Check-in"];

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  onRetry,
  disabled,
  isStreaming,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onRetry?: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const hasImages = Array.from(e.clipboardData.items).some(
      (item) => item.type.startsWith("image/"),
    );
    if (hasImages) {
      e.preventDefault();
      alert("ไม่รองรับการวางรูปภาพ กรุณาพิมพ์ข้อความแทน");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  return (
    <div className="sticky bottom-0 z-10 bg-[rgba(21,17,32,0.95)] pt-2 pb-3 backdrop-blur-xl">
      {/* Input row */}
      <div className="flex items-center gap-2 rounded-2xl border border-[rgba(208,188,255,0.18)] bg-[rgba(255,255,255,0.05)] backdrop-blur-[24px] px-3 py-2.5">
        <button
          className="shrink-0 text-[#494454] hover:text-[#d0bcff] transition-colors p-1"
          type="button"
          aria-label="Attach"
        >
          <Plus className="h-5 w-5" />
        </button>

        <textarea
          ref={textareaRef}
          className="flex-1 resize-none bg-transparent text-[14px] leading-5 text-[#e8dff5] outline-none placeholder:text-[#494454] font-normal"
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Reflect on your day..."
          rows={1}
          style={{ minHeight: "20px", maxHeight: "120px" }}
          value={value}
        />

        <div className="flex shrink-0 items-center gap-1">
          <button
            className="text-[#494454] hover:text-[#d0bcff] transition-colors p-1.5"
            type="button"
            aria-label="Voice input"
          >
            <Mic className="h-5 w-5" />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d0bcff] text-[#3c0091] hover:bg-[#e9ddff] active:scale-95 transition-all shadow-[0_4px_16px_rgba(208,188,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={disabled}
            onClick={onSubmit}
            type="button"
            aria-label="Send"
          >
            {isStreaming ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Quick chips */}
      <div className="mt-2.5 flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip}
            className="shrink-0 whitespace-nowrap rounded-full border border-[rgba(208,188,255,0.15)] bg-[rgba(255,255,255,0.04)] px-3 py-1 font-label text-[10px] uppercase tracking-[0.08em] text-[#958ea0] hover:bg-[rgba(208,188,255,0.06)] hover:text-[#cbc3d7] transition-colors"
            type="button"
          >
            {chip}
          </button>
        ))}
        {onRetry && (
          <button
            className="shrink-0 flex items-center gap-1 whitespace-nowrap rounded-full border border-[rgba(208,188,255,0.2)] bg-[rgba(208,188,255,0.06)] px-3 py-1 font-label text-[10px] uppercase tracking-[0.08em] text-[#d0bcff] transition-colors"
            onClick={onRetry}
            type="button"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
