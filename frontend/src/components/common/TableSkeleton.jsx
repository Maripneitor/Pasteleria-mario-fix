import React from 'react';
import Skeleton from './Skeleton';

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
    return (
        <div className="w-full overflow-hidden rounded-lg border border-gray-200">
            <div className="bg-gray-50 border-b border-gray-200 p-4 flex gap-4">
                {[...Array(columns)].map((_, i) => (
                    <Skeleton key={`head-${i}`} variant="text" width={`${80 / columns}%`} height="20px" className="bg-gray-300" />
                ))}
            </div>
            <div className="bg-white divide-y divide-gray-100">
                {[...Array(rows)].map((_, r) => (
                    <div key={`row-${r}`} className="p-4 flex gap-4">
                        {[...Array(columns)].map((_, c) => (
                            <Skeleton key={`cell-${r}-${c}`} variant="text" width={`${90 / columns}%`} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TableSkeleton;
