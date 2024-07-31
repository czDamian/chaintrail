/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "bounce-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-500px)",
          },
          "60%": {
            opacity: "1",
            transform: "translateY(30px)",
          },
          "80%": {
            transform: "translateY(-10px)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(40deg)" },
        },
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        cinzel: ["Cinzel", "serif"],
        kronaOne: ["Krona One", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
      },
      animation: {
        "bounce-in-down": "bounce-in-down 1s ease-out",
        rotate: "rotate 10s linear infinite",
      },
      colors: {
        "gold-500": "#E4AD00",
      },
    },
  },
  plugins: [],
};
