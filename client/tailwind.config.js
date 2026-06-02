export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: { 
      colors: {
        bluestock: {
          dark: "#222222",      // Main Text/Background
          blue: "#414BEA",      // Primary Action
          lightBlue: "#D9E2FF", // Soft UI elements
          orange: "#F05537",    // CTA/Alerts (Logo accent)
          purple: "#7752FE",    // Secondary/Vibrant
          deepNavy: "#190482",  // Headers
          gray: "#3D3B40",      // Neutral
          lavender: "#F8EDFF"   // Section background
        }
      }
    },
  },
  plugins: [],
};
