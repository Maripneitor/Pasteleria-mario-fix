import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ completed, total, label }) => {
    const percentage = Math.min(100, Math.max(0, (completed / total) * 100));

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                <span className="text-xs font-bold text-brand-primary">{completed}/{total}</span>
            </div>
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-brand-primary rounded-full"
                />
            </div>
        </div>
    );
};

export default ProgressBar;
