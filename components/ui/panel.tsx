import type { HTMLAttributes } from "react";

import { cn } from "@/src/lib/utils";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-white/12 bg-white/6.5 shadow-glow backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
