/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "400px",
      },
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
        glow: {
          "0%": {
            boxShadow:
              "0 0 5px rgba(255, 255, 0, 0.5), 0 0 10px rgba(255, 255, 0, 0.5), 0 0 20px rgba(255, 255, 0, 0.5)",
          },
          "50%": {
            boxShadow:
              "0 0 10px rgba(255, 255, 0, 1), 0 0 20px rgba(255, 255, 0, 1), 0 0 30px rgba(255, 255, 0, 1)",
          },
          "100%": {
            boxShadow:
              "0 0 5px rgba(255, 255, 0, 0.5), 0 0 10px rgba(255, 255, 0, 0.5), 0 0 20px rgba(255, 255, 0, 0.5)",
          },
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
        glow: "glow 1.5s infinite alternate",
      },
      colors: {
        "gold-500": "#E4AD00",
        "dark-900": "#121212",
        "dark-800": "#1E1E1E",
        "dark-700": "#1E1E1E",
        "light-400": "#444444",
      },
    },
  },
  plugins: [],
};
