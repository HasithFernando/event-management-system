/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                border: "rgba(0, 0, 0, 0.1)",
                input: "transparent",
                ring: "oklch(0.708 0 0)",
                background: "#ffffff",
                foreground: "oklch(0.145 0 0)",
                primary: {
                    DEFAULT: "#030213",
                    foreground: "#ffffff",
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                secondary: {
                    DEFAULT: "oklch(0.95 0.0058 264.53)",
                    foreground: "#030213",
                },
                destructive: {
                    DEFAULT: "#d4183d",
                    foreground: "#ffffff",
                },
                muted: {
                    DEFAULT: "#ececf0",
                    foreground: "#717182",
                },
                accent: {
                    DEFAULT: "#e9ebef",
                    foreground: "#030213",
                },
                popover: {
                    DEFAULT: "#ffffff",
                    foreground: "oklch(0.145 0 0)",
                },
                card: {
                    DEFAULT: "#ffffff",
                    foreground: "oklch(0.145 0 0)",
                },
            },
            borderRadius: {
                lg: "0.625rem",
                md: "calc(0.625rem - 2px)",
                sm: "calc(0.625rem - 4px)",
            },
        },
    },
    plugins: [],
}
