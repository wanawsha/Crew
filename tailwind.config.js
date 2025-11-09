/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./*.html",
        "./pages/**/*.html",
        "./js/**/*.js",
    ],
    theme: {
        extend: {
            colors: {
                'main-bg': '#e7e7e7',
            }
        },
    },
    plugins: [],
}