module.exports = {
  // darkMode: ['class', '[data-theme="dark"]'],
  content: ["./src/**/*.{html,svelte,ts,js}", "../ui/src/**/*.{html,svelte,ts,js}"],
  theme: {
    colors: {
      primary: "var(--oss-app-color-teal)",
      secondary: "var(--oss-app-color-purple)",
      accent: "var(--oss-app-color-purple)",
      green: "var(--oss-app-color-green)",
      teal: "var(--oss-app-color-teal)",
      blue: "var(--oss-app-color-blue)",
      purple: {
        700: "var(--oss-app-color-purple)",
        900: "var(--oss-app-color-purple-900)"
      },
      black: "var(--oss-app-color-black)",
      white: "var(--oss-app-color-white)",
      gray: "var(--oss-app-color-gray)"
    },
    extend: {
      fontFamily: {
        inter: ["inter", "sans-serif"],
        mona: ["mona-sans", "sans-serif"]
      },
      typography: {
        excerpt: {
          css: {
            p: {
              fontFamily: "font-inter",
              fontSize: "font-2xl"
            }
          }
        }
      }
    }
  },
  plugins: [
    // require('tailwindcss-animate'),
    require("@tailwindcss/line-clamp")
  ]
};
