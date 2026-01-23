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
                    milk: '#fdfcf0',   // Crema suave (Legacy support)
                    50: '#fef2f2',
                    100: '#fee2e2',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                    950: '#1a0d0d',    // Fondo oscuro profundo

                    // New "La Fiesta" Design Tokens
                    primary: '#E31C79', // Rojo Cereza Vibrante
                    secondary: '#FDFCF0', // Crema / Vainilla
                    accent: '#3E2723', // Chocolate Profundo
                    surface: '#FFFFFF', // Blanco Puro
                    muted: '#F5F5F5', // Gris muy claro para fondos secundarios
                },
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
                display: ['Poppins', 'Inter', 'sans-serif'], // For headers if needed
            }
        },
    },
    plugins: [],
}
