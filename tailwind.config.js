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
      animation: {
        'pulse-fast': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Faster pulse animation
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
