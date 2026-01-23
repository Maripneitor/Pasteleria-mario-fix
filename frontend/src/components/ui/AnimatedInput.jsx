import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedInput = ({
    label,
    id,
    type = 'text',
    error,
    register,
    validation = {},
    className = '',
    placeholder = ' ' // Required for :placeholder-shown trick if using CSS key, but we use motion state
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    // Handler to combine external register (react-hook-form) with local state
    const handleBlur = (e) => {
        setIsFocused(false);
        setHasValue(e.target.value.length > 0);
        if (register && register(id).onBlur) register(id).onBlur(e);
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        if (register && register(id).onFocus) register(id).onFocus(e);
    };

    // Fallback if passing simple onChange
    const handleChange = (e) => {
        setHasValue(e.target.value.length > 0);
        if (register && register(id).onChange) register(id).onChange(e);
    };

    return (
        <div className={`relative mb-4 ${className}`}>
            <div className="relative">
                <input
                    id={id}
                    type={type}
                    className={`
                        peer w-full px-4 py-3 
                        bg-white/50 dark:bg-slate-800/50 
                        border-2 rounded-xl outline-none transition-colors duration-200
                        ${error
                            ? 'border-red-400 focus:border-red-500 text-red-900 placeholder-transparent'
                            : 'border-slate-200 dark:border-slate-700 focus:border-bakery-primary text-slate-800 dark:text-slate-100'
                        }
                    `}
                    {...(register ? register(id, validation) : {})}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={placeholder} // Keeps space for layout but hidden by logic usually
                />
                <motion.label
                    htmlFor={id}
                    initial={false}
                    animate={{
                        y: isFocused || hasValue ? -24 : 12,
                        x: isFocused || hasValue ? 0 : 12,
                        scale: isFocused || hasValue ? 0.85 : 1,
                        color: error ? '#f87171' : isFocused ? '#E31C79' : '#94a3b8'
                    }}
                    transition={{ duration: 0.2 }}
                    className={`
                        absolute left-0 top-0 pointer-events-none origin-left font-medium
                    `}
                >
                    {label}
                </motion.label>
            </div>
            {error && (
                <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 mt-1 ml-1"
                >
                    {error.message}
                </motion.span>
            )}
        </div>
    );
};

export default AnimatedInput;
