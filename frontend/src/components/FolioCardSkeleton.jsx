import React from 'react';
import Skeleton from './common/Skeleton';

const FolioCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <Skeleton variant="text" width="40px" height="12px" className="mb-2" />
                    <Skeleton variant="text" width="64px" height="24px" />
                </div>
                <Skeleton variant="circle" width="80px" height="24px" />
            </div>

            {/* Body */}
            <div className="space-y-4 mb-4 flex-grow">
                <div className="flex items-center gap-3">
                    <Skeleton variant="circle" width="32px" height="32px" />
                    <div className="space-y-2 w-full">
                        <Skeleton variant="text" width="75%" height="16px" />
                        <Skeleton variant="text" width="50%" height="12px" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Skeleton variant="rect" width="20px" height="20px" />
                    <Skeleton variant="text" width="66%" height="16px" />
                </div>

                <Skeleton variant="rect" height="80px" className="w-full rounded-lg" />
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-50 flex justify-between items-end mt-auto">
                <div>
                    <Skeleton variant="text" width="32px" height="12px" className="mb-1" />
                    <Skeleton variant="text" width="64px" height="24px" />
                </div>
                <div>
                    <Skeleton variant="text" width="48px" height="12px" className="mb-1 ml-auto" />
                    <Skeleton variant="text" width="56px" height="20px" className="ml-auto" />
                </div>
            </div>
        </div>
    );
};

export default FolioCardSkeleton;
