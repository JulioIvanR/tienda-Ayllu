import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-[#f1e7d5] text-[#373737] border border-[#dfd2be]",
    success: "bg-[#a8bca8]/35 text-[#2e5e4e] border border-[#a8bca8] font-semibold",
    warning: "bg-[#ca9029]/20 text-[#5d3805] border border-[#ca9029]/50 font-semibold",
    danger: "bg-rose-100 text-rose-800 border border-rose-300",
    info: "bg-[#a8bca8]/40 text-[#2e5e4e] border border-[#a8bca8]",
    outline: "border border-[#dfd2be] text-[#373737]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
