import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from 'path';

const isMock = process.env.BUILD_FOR === 'preview';

const config: UserConfig = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'@tea/ui/*': path.resolve('../ui/src/*'),
			// this dynamic-ish static importing is followed by the svelte build
			// but for vscode editing intellisense tsconfig.json is being used
			'@api': isMock ? path.resolve('src/libs/api/mock.ts') : path.resolve('src/libs/api/tauri.ts'),
			$components: path.resolve('./src/components'),
			$libs: path.resolve('./src/libs'),
			$appcss: path.resolve('./src/app.css')
		}
	}
};

export default config;
