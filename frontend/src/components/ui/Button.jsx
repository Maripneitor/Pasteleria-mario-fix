import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const Button = React.forwardRef(
  ({ className, variant = "solid", size = "md", isLoading, disabled, children, ...props }, ref) => {

    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50 ring-offset-background";

    const variants = {
      solid: "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-sm",
      outline: "border border-input bg-transparent hover:bg-surface-muted hover:text-brand-primary text-text-primary",
      ghost: "hover:bg-surface-muted hover:text-brand-primary text-text-secondary",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
      secondary: "bg-brand-secondary text-white hover:bg-brand-secondary/90 shadow-sm",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-8 text-base",
      icon: "h-10 w-10",
    };

    const comp = (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );

    return comp;
  }
);

Button.displayName = "Button";

export { Button, cn };
