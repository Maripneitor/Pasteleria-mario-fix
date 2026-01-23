import React from 'react';
import { Outlet } from 'react-router-dom';
import ResponsiveNavigation from '../ResponsiveNavigation';

const DashboardLayout = ({ children }) => {
    // If children are provided, use them. Otherwise, use Outlet.
    const content = children || <Outlet />;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-bakery-950 text-gray-900 dark:text-white font-sans transition-colors duration-300">
            {/* Unified Navigation System */}
            <ResponsiveNavigation />

            {/* Main Content Area */}
            {/* lg:ml-64 accommodates the fixed desktop sidebar */}
            {/* pt-16 accommodates the fixed mobile header (which is h-16) */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-64 pt-16 lg:pt-0 h-full overflow-y-auto transition-all duration-300">
                <main className="flex-1 p-6">
                    {content}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
