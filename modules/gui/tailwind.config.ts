import { theme, plugins } from '@tea/ui/tailwind.config.cjs';
module.exports = {
	content: ['./src/**/*.{html,svelte,ts,js}', '../ui/src/**/*.{html,svelte,ts,js}'],
	theme,
	plugins: [...plugins]
};
