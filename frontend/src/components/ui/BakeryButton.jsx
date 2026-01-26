import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const BakeryButton = ({
    children,
    variant = 'solid',
    size = 'md',
    className,
    isLoading,
    icon: Icon,
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        solid: "bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/20",
        outline: "border-2 border-primary text-primary hover:bg-primary/10",
        ghost: "text-text-primary hover:bg-surface-muted hover:text-primary",
        danger: "bg-status-danger text-white hover:brightness-110"
    };

    const sizes = {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base"
    };

    // A11y Check: warn if icon-only button has no accessible label
    if (!children && Icon && !props['aria-label'] && !props.title) {
        console.warn('BakeryButton: Icon-only button requires aria-label or title for accessibility.');
    }

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            aria-label={props['aria-label']}
            {...props}
            type={props.type || 'button'}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            )}
            {!isLoading && Icon && <Icon className={cn("h-4 w-4", children ? "mr-2" : "")} />}
            {children}
        </motion.button>
    );
};

export default BakeryButton;
