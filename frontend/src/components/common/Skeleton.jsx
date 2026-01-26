import React from 'react';

const Skeleton = ({
    className = "",
    variant = "rect", // rect, circle, text
    width,
    height,
    animation = "pulse" // pulse, wave, none
}) => {
    const baseClasses = "bg-gray-200 dark:bg-gray-700 block";

    const variantClasses = {
        rect: "rounded-md",
        circle: "rounded-full",
        text: "rounded h-4 w-full"
    };

    const animationClasses = {
        pulse: "animate-pulse",
        wave: "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]",
        none: ""
    };

    const styles = {};
    if (width) styles.width = width;
    if (height) styles.height = height;

    return (
        <span
            className={`
        ${baseClasses} 
        ${variantClasses[variant] || variantClasses.rect} 
        ${animationClasses[animation] || animationClasses.pulse} 
        ${className}
      `}
            style={styles}
            role="status"
            aria-label="Cargando..."
        >
            <span className="sr-only">Cargando...</span>
        </span>
    );
};

export default Skeleton;
