/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: "#FFF8F0",
          coral: "#FF7A59",
          saffron: "#F8B400",
          leaf: "#2D6A4F",
          ink: "#1E1A1D",
        },
      },
      fontFamily: {
        heading: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px rgba(30, 26, 29, 0.08)",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        floatIn: "floatIn 450ms ease-out both",
      },
    },
  },
  plugins: [],
};
