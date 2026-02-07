/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#FFFBF5',
        'warm': '#F5F0E8',
        'accent': '#E27B60',
        'dark': '#1a1a1a',
      },
    },
  },
  plugins: [],
}
