/** @type {import('tailwindcss').Config} */
const { theme, plugins } = require('@tea/ui/tailwind.config.cjs');
module.exports = {
	content: ['./src/**/*.{html,svelte,ts,js}', '../ui/src/**/*.{html,svelte,ts,js}'],
	theme,
	plugins: [...plugins]
};
