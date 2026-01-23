import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
    solid: "bg-bakery-primary text-white hover:bg-bakery-800 shadow-md border-transparent",
    outline: "bg-transparent border-2 border-bakery-primary text-bakery-primary hover:bg-bakery-50",
    ghost: "bg-transparent text-bakery-accent hover:bg-bakery-100/50 hover:text-bakery-primary border-transparent"
};

const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3 text-lg"
};

const BakeryButton = ({
    children,
    onClick,
    variant = 'solid',
    size = 'md',
    icon: Icon,
    isLoading = false,
    className = '',
    disabled = false,
    type = 'button'
}) => {
    return (
        <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`
                relative inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 border
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:y-0
                ${variants[variant]} 
                ${sizes[size]} 
                ${className}
            `}
            onClick={disabled || isLoading ? undefined : onClick}
            disabled={disabled || isLoading}
            type={type}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!isLoading && Icon && <Icon className="w-5 h-5" />}
            <span>{children}</span>
        </motion.button>
    );
};

export default BakeryButton;
