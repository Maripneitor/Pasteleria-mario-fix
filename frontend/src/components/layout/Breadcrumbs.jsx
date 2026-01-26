import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '../../config/routes.config'; // We haven't created this yet but will next

// Helper to find route config by path matching
const findRouteByPath = (path, routes) => {
    // Exact match first
    let match = routes.find(r => r.path === path);
    if (match) return match;

    // Parameterized match (simple version for :id)
    // Convert config paths like /foo/:id to regex
    // This is simple, for complex matching use matchPath from react-router
    return routes.find(r => {
        if (!r.path.includes(':')) return false;

        const rParts = r.path.split('/');
        const pParts = path.split('/');

        if (rParts.length !== pParts.length) return false;

        return rParts.every((part, i) => {
            return part.startsWith(':') || part === pParts[i];
        });
    });
};

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // If we are on dashboard root, don't show just "Home" or empty
    if (pathnames.length === 0) return null;

    let currentPath = '';

    // Static mapping or lookup could be enhanced here
    // For now, will generate crumbs dynamically based on segments
    // and try to map to human readable names if possible from ROUTES config.

    // Flatten routes for easier lookup
    // Assuming ROUTES is flat or we traverse it. For this implementation we might iterate.

    return (
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6 overflow-x-auto whitespace-nowrap pb-1">
            <Link
                to="/dashboard"
                className="flex items-center hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
                <Home className="w-4 h-4" />
            </Link>

            {pathnames.map((name, index) => {
                currentPath += `/${name}`;
                const isLast = index === pathnames.length - 1;

                // Capitalize or format name
                // Ideally this comes from route config 'breadcrumb' prop
                let displayName = name.charAt(0).toUpperCase() + name.slice(1);

                // Simple heuristics for better names
                if (name === 'admin') displayName = 'Admin';
                if (name === 'dashboard') return null; // Skip dashboard in list if we used Home icon

                // Try to find in config
                // NOTE: We need to import ROUTES or pass it in. 
                // Since this runs before ROUTES file exists, we'll keep it simple for now and rely on future improvement or props.

                return (
                    <React.Fragment key={currentPath}>
                        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
                        {isLast ? (
                            <span className="font-medium text-gray-900 dark:text-gray-200">
                                {displayName}
                            </span>
                        ) : (
                            <Link
                                to={currentPath}
                                className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                                {displayName}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
