/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    fontFamily: {
      sans: ["iosevka-web", "ui-sans-serif", "system-ui"],
      serif: ["ui-serif", "Georgia"],
      mono: ["iosevka-web", "ui-monospace", "SFMono-Regular"],
      heads: ["Roboto Slab", "sans-serif"],
    },
    screens: {
      "2xl": "1400px",
    },
    extend: {
      fontSize: {
        "2xs": "0.625rem", // 10px
      },
    },
  },
  plugins: [],
};
