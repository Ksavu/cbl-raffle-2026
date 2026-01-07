export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#16E0FF",
          purple: "#C23BFF",
          dark: "#050B2E",
          surface: "#0E1A4F",
          white: "#FFFFFF",
        },
      },
      boxShadow: {
        glow: "0 0 25px rgba(22, 224, 255, 0.35)",
        purpleGlow: "0 0 25px rgba(194, 59, 255, 0.35)",
      },
    },
  },
  plugins: [],
};

