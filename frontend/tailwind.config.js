/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bakery: {
                    cream: '#FDFBF7', // Fondo principal
                    milk: '#FFFFFF', // Contenedores
                    accent: '#D4A373', // Dorado/Café suave para destacados
                    text: '#4A403A', // Texto principal (café oscuro)
                    muted: '#9C8C74', // Texto secundario
                    highlight: '#FAEDCD', // Fondos suaves
                    success: '#CCD5AE', // Verde pastel para éxito
                    error: '#E6B8A2', // Rojo/Naranja pastel para errores
                    primary: '#D4A373',
                    secondary: '#FEFAE0',
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
            }
        },
    },
    plugins: [],
}
