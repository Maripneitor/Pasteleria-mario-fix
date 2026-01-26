import React from 'react';
import { cn } from '../../utils/cn';

const AnimatedInput = ({ label, className, error, id, register, validation, type = 'text', ...props }) => {
    // Check if type is textarea to render conditionally
    const isTextarea = type === 'textarea';

    // Extract react-hook-form props if register is provided
    const registerProps = register && id ? register(id, validation) : {};

    const errorId = error ? `${id}-error` : undefined;

    return (
        <div className="relative group mb-4">
            {isTextarea ? (
                <textarea
                    id={id}
                    className={cn(
                        "peer w-full rounded-lg border-2 bg-surface/50 px-4 py-3 text-text-primary outline-none transition-all placeholder-shown:border-border h-32 resize-none",
                        "focus:border-primary focus:ring-4 focus:ring-primary/10",
                        error ? "border-status-danger focus:border-status-danger focus:ring-status-danger/10" : "border-border",
                        "disabled:bg-surface-muted disabled:cursor-not-allowed",
                        className
                    )}
                    placeholder=" "
                    aria-invalid={!!error}
                    aria-describedby={errorId}
                    {...registerProps}
                    {...props}
                />
            ) : (
                <input
                    id={id}
                    type={type}
                    className={cn(
                        "peer w-full rounded-lg border-2 bg-surface/50 px-4 py-3 text-text-primary outline-none transition-all placeholder-shown:border-border",
                        "focus:border-primary focus:ring-4 focus:ring-primary/10",
                        error ? "border-status-danger focus:border-status-danger focus:ring-status-danger/10" : "border-border",
                        "disabled:bg-surface-muted disabled:cursor-not-allowed",
                        className
                    )}
                    placeholder=" "
                    aria-invalid={!!error}
                    aria-describedby={errorId}
                    {...registerProps}
                    {...props}
                />
            )}

            <label
                htmlFor={id}
                className={cn(
                    "pointer-events-none absolute left-4 top-3 origin-[0] -translate-y-6 scale-75 transform bg-surface px-1 text-sm duration-200",
                    error ? "text-status-danger" : "text-text-muted",
                    "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100",
                    "peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary",
                    "peer-disabled:text-text-muted/50"
                )}>
                {label}
            </label>
            {error && (
                <span id={errorId} className="mt-1 text-xs text-status-danger" role="alert">
                    {error.message || error}
                </span>
            )}
        </div>
    );
};

export default AnimatedInput;
