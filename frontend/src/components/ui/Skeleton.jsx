import React from 'react';
import { cn } from '../../utils/cn';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-slate-700", className)}
            {...props}
        />
    );
};

export default Skeleton;
