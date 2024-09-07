module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'drexel-blue': '#07294d',
        'drexel-yellow': '#ffc600',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}