import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

const variants = {
  primary: "bg-orange-600 hover:bg-orange-700 text-white shadow-sm relative overflow-hidden group",
  secondary: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm",
  ghost: "hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25",
  link: "text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline-offset-4 hover:underline",
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
          hover:shadow-md
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
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
