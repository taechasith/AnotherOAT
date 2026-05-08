import type { HTMLAttributes } from "react";

import { cn } from "@/src/lib/utils";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[rgba(208,188,255,0.15)] bg-[rgba(255,255,255,0.07)] shadow-[0_0_40px_10px_rgba(139,92,246,0.08)] backdrop-blur-[24px] transition-colors",
        className,
      )}
      {...props}
    />
  );
}
