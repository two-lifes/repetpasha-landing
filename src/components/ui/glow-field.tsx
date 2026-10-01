import { cn } from "@/lib/utils";
import * as React from "react";

type GlowFieldProps = {
  label: string;
  hint?: string;
  id: string;
  inputClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const GlowField = React.forwardRef<HTMLInputElement, GlowFieldProps>(
  ({ label, hint, id, className, inputClassName, ...props }, ref) => (
    <div className={cn("group", className)}>
      <label htmlFor={id} className="text-sm font-medium text-zinc-300">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full border-0 border-b border-white/10 bg-transparent py-3 text-lg text-zinc-50 outline-none placeholder:text-zinc-600",
            inputClassName,
          )}
          {...props}
        />
        <span
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-0.5 w-0 bg-zinc-300 shadow-[0_0_12px_rgba(212,212,216,0.35)] transition-[width] duration-500 ease-out group-focus-within:w-full"
          aria-hidden
        />
      </div>
      {hint ? <p className="mt-2 text-xs text-zinc-500">{hint}</p> : null}
    </div>
  ),
);
GlowField.displayName = "GlowField";
