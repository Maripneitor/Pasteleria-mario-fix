import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const badgeVariants = {
    default:
        "border-transparent bg-brand-primary text-white hover:bg-brand-primary/80",
    secondary:
        "border-transparent bg-brand-secondary text-white hover:bg-brand-secondary/80",
    destructive:
        "border-transparent bg-red-500 text-white hover:bg-red-600",
    outline: "text-text-primary",
    success: "border-transparent bg-green-500 text-white hover:bg-green-600",
    warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
    info: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
};

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

function Badge({ className, variant = "default", ...props }) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                badgeVariants[variant],
                className
            )}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
