"use client";

import { LoaderCircle, RotateCcw, SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

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
  return (
    <Panel className="sticky bottom-0 z-10 border-white/10 bg-[rgba(14,16,24,0.82)] p-2.5 backdrop-blur-xl sm:p-4">
      <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-3 dark:bg-black/30 sm:rounded-[1.5rem]">
        <textarea
          className="min-h-20 w-full resize-none bg-transparent text-[15px] leading-6 text-white outline-none placeholder:text-white/35 sm:min-h-24 sm:leading-7"
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder="พิมพ์สิ่งที่อยากคุย เช่น วันนี้ผมควรยอมรับอะไร และควรวางอะไรลงบ้าง"
          value={value}
        />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-white/42 sm:leading-6">
            คำตอบจะค่อย ๆ ปรากฏแบบสตรีม พร้อมสถานะ timeout, retry และ fallback
          </p>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
            {onRetry ? (
              <Button className="w-full sm:w-auto" onClick={onRetry} type="button" variant="ghost">
                <RotateCcw className="mr-2 h-4 w-4" />
                ส่งข้อความล่าสุดอีกครั้ง
              </Button>
            ) : null}
            <Button className="w-full sm:w-auto" disabled={disabled} onClick={onSubmit} type="button">
              {isStreaming ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SendHorizonal className="mr-2 h-4 w-4" />
              )}
              {isStreaming ? "กำลังตอบ..." : "ส่งข้อความ"}
            </Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}
