/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-dark': '#01579B',
                'primary': '#0277BD',
                'accent-blue': '#039BE5',
                'light-bg': '#B3E5FC',
                'teal-custom': '#028090',
                'green-accent': '#00A896'
            }
        },
    },
    plugins: [],
}
