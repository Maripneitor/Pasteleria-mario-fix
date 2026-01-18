import React from 'react';

const FolioCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-4 animate-pulse">
                <div>
                    <div className="h-3 w-10 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            </div>

            {/* Body */}
            <div className="space-y-4 mb-4 flex-grow animate-pulse">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-200 rounded-full shrink-0"></div>
                    <div className="space-y-2 w-full">
                        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-gray-200 rounded shrink-0"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>

                <div className="h-20 bg-gray-200 rounded-lg w-full"></div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-50 flex justify-between items-end mt-auto animate-pulse">
                <div>
                    <div className="h-3 w-8 bg-gray-200 rounded mb-1"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
                <div>
                    <div className="h-3 w-12 bg-gray-200 rounded mb-1 ml-auto"></div>
                    <div className="h-5 w-14 bg-gray-200 rounded ml-auto"></div>
                </div>
            </div>
        </div>
    );
};

export default FolioCardSkeleton;
