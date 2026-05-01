import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

const variants = {
  primary:
    "bg-[linear-gradient(135deg,#08101d_0%,#0f4c61_62%,#ea580c_100%)] text-white shadow-[0_18px_40px_-26px_rgba(8,16,29,0.78)] hover:-translate-y-0.5 hover:shadow-[0_24px_44px_-24px_rgba(14,116,144,0.42)]",
  secondary:
    "bg-white/80 dark:bg-slate-950/45 border border-slate-200/85 dark:border-cyan-950/60 hover:bg-cyan-50/65 dark:hover:bg-slate-900 hover:border-cyan-300 dark:hover:border-cyan-800 text-slate-700 dark:text-slate-100 shadow-[0_12px_28px_-24px_rgba(8,16,29,0.58)] backdrop-blur-sm",
  ghost:
    "hover:bg-cyan-50 dark:hover:bg-cyan-950/25 text-slate-700 dark:text-cyan-200",
  danger:
    "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-[0_18px_34px_-24px_rgba(239,68,68,0.55)]",
  link:
    "text-cyan-700 dark:text-cyan-300 hover:text-orange-600 dark:hover:text-orange-300 underline-offset-4 hover:underline",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const Button = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      children,
      disabled = false,
      isLoading = false,
      to,
      onClick,
      ...props
    },
    ref
  ) => {
    const navigate = useNavigate();

    const handleClick = (e) => {
      if (onClick) {
        onClick(e);
      }
      if (to && !disabled && !isLoading) {
        navigate(to);
      }
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={`
          inline-flex items-center justify-center gap-2
          font-semibold rounded-lg
          transition-all duration-200
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
