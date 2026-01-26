/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Importante para que funcione .dark
    theme: {
        extend: {
            colors: {
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                background: "var(--bg-surface)",
                foreground: "var(--text-primary)",

                brand: {
                    primary: "var(--brand-primary)", // Premium: Cherry Red
                    secondary: "var(--brand-secondary)", // Premium: Dark Chocolate
                    accent: "var(--brand-accent)", // Premium: Gold
                },
                surface: {
                    DEFAULT: "var(--bg-surface)",
                    card: "var(--bg-card)",
                    muted: "var(--bg-muted)",
                },
                text: {
                    primary: "var(--text-primary)",
                    secondary: "var(--text-secondary)",
                },
            },
            // Animaciones existentes se mantienen aquí...
            animation: {
                'slide-up': 'slideUp 0.3s ease-out',
                'fade-in': 'fadeIn 0.2s ease-out',
            },
            keyframes: {
                slideUp: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            }
        },
    },
    plugins: [],
}
