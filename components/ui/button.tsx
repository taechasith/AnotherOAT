import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-[#e9ddff] text-[#23005c] shadow-[0_4px_24px_rgba(208,188,255,0.25)] hover:bg-[#d0bcff] hover:-translate-y-0.5 active:scale-[0.97] rounded-xl",
        ghost:
          "bg-[rgba(255,255,255,0.07)] text-[#d0bcff] border border-[rgba(208,188,255,0.2)] hover:bg-[rgba(255,255,255,0.12)] hover:-translate-y-0.5 active:scale-[0.97] rounded-xl backdrop-blur-[24px]",
      },
      size: {
        default: "h-12 px-5",
        lg: "h-14 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
