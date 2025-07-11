/**@type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        ...colors,
        main: {
          500: "#615FFF",
        },
        secondary: "#8785FF",
        accent: "#31E981",
        grey: "D8E4FF",
      },
      fontFamily: {
        noto: ["Noto Sans", ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
