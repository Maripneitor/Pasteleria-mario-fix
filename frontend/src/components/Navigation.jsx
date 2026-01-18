import React, { useState, useEffect } from 'react';
import DesktopSidebar from './ui/DesktopSidebar';
import MobileNav from './ui/MobileNav';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const { logout } = useAuth();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {isMobile ? (
                <MobileNav onLogout={logout} />
            ) : (
                <DesktopSidebar onLogout={logout} />
            )}
        </>
    );
};

export default Navigation;
