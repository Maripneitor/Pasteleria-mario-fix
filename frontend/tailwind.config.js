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
                    milk: '#fdfcf0',   // Crema suave
                    primary: '#ef4444', // Rojo marca
                    50: '#fef2f2',
                    100: '#fee2e2',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                    950: '#1a0d0d',    // Fondo oscuro profundo
                },
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
            }
        },
    },
    plugins: [],
}
