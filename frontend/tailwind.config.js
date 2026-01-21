/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                bakery: {
                    // Professional Slate Palette
                    // Light Mode
                    50: '#F8FAFC', // Slate-50: Background Light
                    100: '#F1F5F9', // Slate-100: Secondary Background
                    200: '#E2E8F0', // Slate-200: Borders / Disabled

                    // Main Text / Elements
                    500: '#64748B', // Slate-500: Muted Text
                    600: '#475569', // Slate-600
                    700: '#334155', // Slate-700: Dark Mode Borders
                    800: '#1E293B', // Slate-800: Dark Mode Cards / Light Mode Text
                    900: '#0F172A', // Slate-900
                    950: '#020617', // Slate-950: Dark Mode Background

                    // Semantic Aliases
                    primary: '#3B82F6', // Blue-500: Primary Action
                    'primary-hover': '#2563EB', // Blue-600
                    success: '#10B981', // Emerald-500
                    error: '#EF4444', // Red-500
                    warning: '#F59E0B', // Amber-500
                },
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
            }
        },
    },
    plugins: [],
}
