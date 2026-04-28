import { forwardRef } from "react";

export const Card = forwardRef(
  ({ className = "", children, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white dark:bg-slate-800
          border border-slate-200 dark:border-slate-700
          rounded-lg
          shadow-sm
          transition-all duration-200
          ${hover ? "hover:shadow-md" : ""}
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
