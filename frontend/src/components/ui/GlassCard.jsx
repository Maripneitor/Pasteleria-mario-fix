import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hoverEffect = true, onClick }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hoverEffect ? { y: -4, shadow: "0 10px 30px -10px rgba(0,0,0,0.1)" } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`
                bg-white/70 dark:bg-slate-800/60 
                backdrop-blur-md 
                border border-white/20 dark:border-white/10 
                shadow-lg 
                rounded-2xl 
                p-6 
                ${onClick ? 'cursor-pointer' : ''} 
                ${className}
            `}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
