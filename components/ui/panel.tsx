import type { HTMLAttributes } from "react";

import { cn } from "@/src/lib/utils";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-white/10 bg-white/[0.055] shadow-glow backdrop-blur-xl transition-colors",
        className,
      )}
      {...props}
    />
  );
}
