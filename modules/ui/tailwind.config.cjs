/** @type {import('tailwindcss').Config} */
const green = "#00ffd0";
const black = "#1a1a1a";
const white = "#fff";
const gray = "#949494";
const purple = "#8000FF";

module.exports = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		colors: {
			primary: green,
			accent: purple,
			green,
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
				sono: ["sono", "sans-serif"],
				machina: ["pp-neue-machina", "sans-serif"]
			},
			typography: {
				excerpt: {
					css: {
						p: {
							fontFamily: "font-machina",
							fontSize: "font-2xl"
						}
					}
				}
			}
		}
	},
	plugins: [require("@tailwindcss/line-clamp")]
};
