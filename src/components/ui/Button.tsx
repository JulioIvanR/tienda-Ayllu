import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "whatsapp" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary:
        "bg-[#b03917] text-white hover:bg-[#8f2c0f] shadow-sm font-semibold focus-visible:ring-[#b03917] active:scale-[0.99]",
      whatsapp:
        "bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-sm font-semibold focus-visible:ring-[#25D366] active:scale-[0.99]",
      secondary:
        "bg-[#a8bca8]/30 text-[#2e5e4e] hover:bg-[#a8bca8]/50 border border-[#a8bca8]/70 font-semibold focus-visible:ring-[#a8bca8]",
      outline:
        "border border-[#dfd2be] bg-white/70 text-[#373737] hover:bg-[#f1e7d5] hover:text-[#2e5e4e]",
      danger:
        "bg-rose-700 text-white hover:bg-rose-800 shadow-sm focus-visible:ring-rose-500",
      ghost:
        "bg-transparent text-[#373737] hover:bg-[#a8bca8]/20 hover:text-[#2e5e4e]",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-md",
      md: "h-10 px-4 py-2 text-sm rounded-lg",
      lg: "h-12 px-6 text-base rounded-xl",
      icon: "h-10 w-10 p-2 rounded-lg justify-center",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
