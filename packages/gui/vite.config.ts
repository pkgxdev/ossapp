import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from 'path';

const config: UserConfig = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'@tea/ui/*': path.resolve('../ui/src/*'),
			$components: path.resolve('./src/components'),
			$libs: path.resolve('./src/libs'),
			$appcss: path.resolve('./src/app.css'),
		}
	}
};

export default config;
