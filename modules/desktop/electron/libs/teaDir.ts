// import { readDir, BaseDirectory } from '@tauri-apps/api/fs';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import semver from 'semver';

type Dir = {
	name: string;
	path: string;
	children?: Dir[];
};
export async function getInstalledPackages() {
	const homePath = app.getPath('home');
	const pkgsPath = path.join(homePath, './.tea');

	const folders = await deepReadDir({
		dir: pkgsPath,
		continueDeeper: (name: string) => !semver.valid(name),
		filter: (name: string) => !!semver.valid(name)
	});

	const pkgs = folders
		.map((p: string) => p.split('.tea/')[1])
		.filter((p: string) => !p.includes('tea.xyz'))
		.map((p: string) => {
			const path = p.trim().split('/');
			const version = path.pop();
			return {
				version: semver.clean(version || ''),
				full_name: path.join('/')
			};
		});

	return pkgs;
}

const semverTest =
	/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/g;

export const getPkgBottles = (packageDir: Dir): string[] => {
	const bottles: string[] = [];

	const pkg = packageDir.path.split('.tea/')[1];
	const version = pkg.split('/v')[1];

	const isVersion = semverTest.test(version) || !isNaN(+version) || version === '*';

	if (version && isVersion) {
		bottles.push(pkg);
	} else if (packageDir?.children?.length) {
		const childBottles = packageDir.children
			.map(getPkgBottles)
			.reduce((arr, bottles) => [...arr, ...bottles], []);
		bottles.push(...childBottles);
	}

	return bottles.filter((b) => b !== undefined).sort(); // ie: ["gohugo.io/v*", "gohugo.io/v0", "gohugo.io/v0.108", "gohugo.io/v0.108.0"]
};

const deepReadDir = async ({
	dir,
	continueDeeper,
	filter
}: {
	dir: string;
	continueDeeper?: (name: string) => boolean;
	filter?: (name: string) => boolean;
}) => {
	const arrayOfFiles: string[] = [];
	try {
		const files = fs.readdirSync(dir, { withFileTypes: true });
		for (const f of files) {
			const nextPath = path.join(dir, f.name);
			const deeper = continueDeeper ? continueDeeper(f.name) : true;
			if (f.isDirectory() && deeper) {
				const nextFiles = await deepReadDir({ dir: nextPath, continueDeeper, filter });
				arrayOfFiles.push(...nextFiles);
			} else if (filter && filter(f.name)) {
				arrayOfFiles.push(nextPath);
			} else if (!filter) {
				arrayOfFiles.push(nextPath);
			}
		}
	} catch (e) {
		console.log(e);
	}
	return arrayOfFiles;
};
