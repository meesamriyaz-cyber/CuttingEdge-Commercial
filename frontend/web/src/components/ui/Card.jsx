import { forwardRef } from "react";

export const Card = forwardRef(
  ({ className = "", children, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white/95 dark:bg-slate-950/70
          border border-slate-200/90 dark:border-cyan-950/55
          rounded-lg
          shadow-[0_18px_42px_-34px_rgba(8,16,29,0.68)]
          backdrop-blur-sm
          transition-all duration-200
          ${hover ? "hover:-translate-y-0.5 hover:border-cyan-300/80 hover:shadow-[0_24px_52px_-34px_rgba(8,16,29,0.72)]" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`p-6 pb-0 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

export const CardBody = forwardRef(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`p-6 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardBody.displayName = "CardBody";

export const CardFooter = forwardRef(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`p-6 pt-0 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";
