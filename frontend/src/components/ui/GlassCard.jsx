import React from 'react';
import { cn } from '../../utils/cn';

const GlassCard = ({ children, className, ...props }) => {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/20 shadow-xl",
                // Modo claro: Fondo blanco con transparencia y blur
                "bg-surface/70 backdrop-blur-md",
                // Modo oscuro: Slate 800 semi-transparente con borde sutil para profundidad
                "dark:bg-surface-card/60 dark:border-white/5 dark:shadow-md",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassCard;
