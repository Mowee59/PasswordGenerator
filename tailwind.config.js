/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        jetBrainsMono: ["JetBrains Mono", "serif"],
      },
      colors: {
        "background-page": "#18171F",
        "background-component": "#24232C",
        "text-dark": "#817D92",
        "text-light": "#E6E5EA",
        accent: "#A4FFAF",
        error: "#F64A4A",
        warning: "#FB7C58",
        caution: "#F8CD65",
      },
    },
  },
  plugins: [],
};
