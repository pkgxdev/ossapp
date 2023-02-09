import { writable } from 'svelte/store';
import type { GUIPackage } from '../types';
import { getPackages } from '@api';
import Fuse from 'fuse.js';
import { getPackage } from '@api';

import { getGithubOwnerRepo, getReadme } from '$libs/github';

export default function initPackagesStore() {
	let initialized = false;
	const { subscribe, set, update } = writable<GUIPackage[]>([]);
	const packages: GUIPackage[] = [];
	let packagesIndex: Fuse<GUIPackage>;

	if (!initialized) {
		initialized = true;
		getPackages().then((pkgs) => {
			set(pkgs);
			packagesIndex = new Fuse(pkgs, {
				keys: ['name', 'full_name', 'desc']
			});
		});
	}

	subscribe((v) => packages.push(...v));

	const updatePackageProp = (full_name: string, props: Partial<GUIPackage>) => {
		update((pkgs) => {
			const i = pkgs.findIndex((pkg) => pkg.full_name === full_name);
			if (i >= 0) {
				pkgs[i] = {
					...pkgs[i],
					...props
				};
			}
			return pkgs;
		});
	};

	return {
		packages,
		subscribe,
		search: async (term: string, limit = 5): Promise<GUIPackage[]> => {
			if (!term || !packagesIndex) return [];
			// TODO: if online, use algolia else use Fuse

			const res = packagesIndex.search(term, { limit });
			const matchingPackages: GUIPackage[] = res.map((v) => v.item);
			return matchingPackages;
		},
		subscribeToPackage: (slug: string, cb: (pkg: GUIPackage) => void) => {
			subscribe((pkgs) => {
				const foundPackage = pkgs.find((p) => p.slug === slug) as GUIPackage;
				if (foundPackage) cb(foundPackage);
				// get readme
				// get contributors
				// get github last modified
				// subscribe((pkgs) => cb(pkgs[pkg]));

				// console.log('f:', foundPackage);
				// getReadmeRaw('');

				if (!foundPackage.bottles) {
					getPackage(foundPackage.full_name).then((pkg) => {
						updatePackageProp(foundPackage.full_name, pkg);
					});
				}

				if (!foundPackage.readme_md && foundPackage.package_yml_url) {
					getGithubOwnerRepo(foundPackage.package_yml_url).then(async ({ owner, repo }) => {
						const defaultReadme = `# ${foundPackage.full_name} #
To read more about this package go to [${foundPackage.homepage}](${foundPackage.homepage}).
						`;
						if (owner && repo) {
							const readme = await getReadme(owner, repo);
							updatePackageProp(foundPackage.full_name, { readme_md: readme || defaultReadme });
						} else {
							updatePackageProp(foundPackage.full_name, { readme_md: defaultReadme });
						}
					});
				}
			});
		}
	};
}

async function getReadmeRaw(owner: string, repo: string): Promise<string> {
	// const rep = await getRepo('oven-sh', 'bun');
	// const repo = await octokit.request('GET /repos/{owner}/{repo}', {
	// 	owner: '',
	// 	repo: '',
	// });
	return '';
}
