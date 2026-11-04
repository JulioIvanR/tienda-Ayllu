import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-[#373737]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-xl border border-[#dfd2be] bg-white px-3 py-2 text-sm text-[#373737] shadow-2xs transition-colors placeholder:text-[#373737]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ca9029] focus-visible:border-[#ca9029] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-rose-500 focus-visible:ring-rose-500 focus-visible:border-rose-500",
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-[#373737]/65">{helperText}</p>
        )}
        {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
