"use client";

import { LoaderCircle, RotateCcw, SendHorizonal } from "lucide-react";

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

  return (
    <div className="sticky bottom-0 z-10 border-0 bg-[rgba(21,17,32,0.90)] p-3 backdrop-blur-xl sm:p-4">
      <div className="rounded-2xl border border-[rgba(208,188,255,0.18)] bg-[rgba(255,255,255,0.05)] backdrop-blur-[24px] flex items-end gap-2 p-3">
        <textarea
          className="flex-1 min-h-[80px] resize-none bg-transparent text-[15px] leading-6 text-[#e8dff5] outline-none placeholder:text-[#494454] font-normal"
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="พิมพ์สิ่งที่อยากสำรวจ เช่น วันนี้ฉันควรรับฟังอะไร และปล่อยอะไรไปได้บ้าง"
          value={value}
        />
        <button
          className="shrink-0 h-9 w-9 rounded-xl bg-[#d0bcff] text-[#3c0091] flex items-center justify-center hover:bg-[#e9ddff] active:scale-95 transition-all shadow-[0_4px_16px_rgba(208,188,255,0.25)] disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={disabled}
          onClick={onSubmit}
          type="button"
        >
          {isStreaming ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizonal className="h-4 w-4" />
          )}
        </button>
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
        <p className="font-label text-[10px] text-[#494454]">
          Enter เพื่อส่ง · Shift+Enter เพื่อขึ้นบรรทัดใหม่
        </p>
        {onRetry ? (
          <button
            className="rounded-xl border border-[rgba(208,188,255,0.15)] bg-transparent text-[#d0bcff] text-xs px-3 py-2 font-label uppercase tracking-[0.08em] hover:bg-[rgba(208,188,255,0.06)] transition-colors"
            onClick={onRetry}
            type="button"
          >
            <RotateCcw className="mr-1.5 h-3 w-3 inline" />
            Send Again
          </button>
        ) : null}
      </div>
    </div>
  );
}
