// import { app } from 'electron';
// import fs from 'fs';
// import { join } from 'upath';

type Dir = {
	name: string;
	path: string;
	children?: Dir[];
};

const { ipcRenderer } = window.require('electron');
export async function getInstalledPackages() {
	console.log('get installed pkgs');
	const pkgs = await ipcRenderer.invoke('get-installed-packages');
	console.log(pkgs);
	// const homePath = app.getPath('home');
	// const packageFolders = (await readDir('.tea/', {
	// 	dir: BaseDirectory.Home,
	// 	recursive: true
	// })) as Dir[];

	// const pkgs = packageFolders
	// 	.filter((p) => p.name !== 'tea.xyz')
	// 	.map(getPkgBottles)
	// 	.filter((pkgBottles) => pkgBottles.length)
	// 	.map((pkgBottles) => {
	// 		const versions = pkgBottles.map((v) => v.split('/v')[1]);
	// 		const full_name = pkgBottles[0].split('/v')[0];

	// 		const isSemverVersion = versions.filter((v) => semverTest.test(v));
	// 		const isNotAsterisk = versions.filter((v) => v !== '*');
	// 		const version =
	// 			(isSemverVersion.length && isSemverVersion[0]) ||
	// 			(isNotAsterisk.length && isNotAsterisk[0]) ||
	// 			'*';
	// 		return {
	// 			version,
	// 			full_name
	// 		};
	// 	});
	// return pkgs;
	return [];
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
