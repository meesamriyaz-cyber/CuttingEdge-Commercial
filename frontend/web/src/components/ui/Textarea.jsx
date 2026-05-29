import { forwardRef } from "react";

export const Textarea = forwardRef(
  (
    { label, error, helperText, className = "", containerClassName = "", rows = 4, ...props },
    ref
  ) => {
    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`
            w-full rounded-lg border bg-white/95 dark:bg-slate-950/65
            px-4 py-2.5 text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            transition-all duration-200
            shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]
            focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-vertical
            ${error ? "border-red-500 focus:ring-red-500" : "border-slate-200 dark:border-slate-700"}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
