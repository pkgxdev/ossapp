const teal = "#00ffd0";
const black = "#1a1a1a";
const white = "#fff";
const gray = "#949494";
const purple = "#8000FF";
const green = "#00A517";
const blue = "#013B99";

module.exports = {
  content: ["./src/**/*.{html,svelte,ts,js}", "../ui/src/**/*.{html,svelte,ts,js}"],
  theme: {
    colors: {
      primary: teal,
      secondary: purple,
      accent: purple,
      green,
      teal,
      blue,
      purple: {
        700: purple,
        900: "#B076EC"
      },
      black,
      white,
      gray
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
  }
};
