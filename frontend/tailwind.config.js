/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Habilitar modo oscuro por clase
    theme: {
        extend: {
            colors: {
                bakery: {
                    cream: '#FDF8F1',
                    chocolate: '#3E2723',
                    'burnt-wood': '#2A1A10',

                    // Legacy/Existing mappings
                    milk: '#FFFFFF',
                    accent: '#D4A373',
                    muted: '#8D6E63',
                    success: '#CCD5AE',
                    error: '#E6B8A2',
                    primary: '#D4A373',
                    secondary: '#FDF8F1',
                    text: '#3E2723',
                    'dark-surface': '#3E2723',
                    'dark-text': '#FDF8F1',
                    'torch-fire': '#E65100',
                },
                'bakery-burnt-wood': '#2A1A10', // Global alias
                'torch-fire': '#E65100',        // Global alias for Torch effect
            },
        },
    },
    plugins: [],
}
