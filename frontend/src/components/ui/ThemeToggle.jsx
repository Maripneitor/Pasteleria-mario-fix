import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} className="p-2 text-bakery-600 dark:text-bakery-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
    );
};

export default ThemeToggle;
