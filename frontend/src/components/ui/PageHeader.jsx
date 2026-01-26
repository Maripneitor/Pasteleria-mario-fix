import React from 'react';
import { cn } from '../../utils/cn';

export function PageHeader({ title, subtitle, action, className }) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6", className)}>
            <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 dark:text-white">
                    {title}
                </h1>
                {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

export default PageHeader;
