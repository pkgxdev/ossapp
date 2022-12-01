/**
 * primarily used to make this desktop app work in the website preview setting in the CI/CD
 * may contain fake/mock data
 *
 * TODO:
 *  * make cors work with api.tea.xyz/v1
 */
import type { Package, Review } from '@tea/ui/types';
import { loremIpsum } from 'lorem-ipsum';
import _ from 'lodash';

const packages: Package[] = [
	{
		slug: 'mesonbuild_com',
		homepage: 'https://mesonbuild.com',
		name: 'mesonbuild.com',
		version: '0.63.3',
		last_modified: '2022-10-06T15:45:08.000Z',
		full_name: 'mesonbuild.com',
		dl_count: 270745,
		thumb_image_name: 'mesonbuild_com_option 1.jpg ',
		maintainer: '',
		desc: 'Fast and user friendly build system',
		thumb_image_url: 'https://tea.xyz/Images/packages/mesonbuild_com.jpg',
		installs: 0
	},
	{
		slug: 'pixman_org',
		homepage: 'http://www.pixman.org/',
		maintainer: 'freedesktop',
		name: 'pixman.org',
		version: '0.40.0',
		last_modified: '2022-09-26T19:37:47.000Z',
		full_name: 'pixman.org',
		dl_count: 0,
		thumb_image_name: 'pixman_org_option 1.jpg ',
		desc: 'Pixman is a library that provides low-level pixel manipulation features such as image compositing and trapezoid rasterization.',
		thumb_image_url: 'https://tea.xyz/Images/packages/pixman_org.jpg',
		installs: 0
	},
	{
		slug: 'freedesktop_org_pkg_config',
		homepage: 'https://freedesktop.org',
		maintainer: 'freedesktop.org',
		name: 'pkg-config',
		version: '0.29.2',
		last_modified: '2022-10-20T01:32:15.000Z',
		full_name: 'freedesktop.org/pkg-config',
		dl_count: 2661501,
		thumb_image_name: 'freedecktop_org_pkg_config option 1.jpg ',
		desc: 'Manage compile and link flags for libraries',
		thumb_image_url: 'https://tea.xyz/Images/packages/freedesktop_org_pkg_config.jpg',
		installs: 0
	},
	{
		slug: 'gnu_org_gettext',
		homepage: 'https://gnu.org',
		maintainer: 'gnu.org',
		name: 'gettext',
		version: '0.21.1',
		last_modified: '2022-10-20T01:23:46.000Z',
		full_name: 'gnu.org/gettext',
		dl_count: 3715970,
		thumb_image_name: 'gnu_org_gettext_option 1.jpg ',
		desc: 'GNU internationalization (i18n) and localization (l10n) library',
		thumb_image_url: 'https://tea.xyz/Images/packages/gnu_org_gettext.jpg',
		installs: 0
	},
	{
		slug: 'ipfs_tech',
		homepage: 'https://ipfs.tech',
		name: 'ipfs.tech',
		version: '0.16.0',
		last_modified: '2022-10-19T21:36:52.000Z',
		full_name: 'ipfs.tech',
		dl_count: 14457,
		thumb_image_name: 'ipfs_tech_option 2.jpg ',
		maintainer: '',
		desc: 'Peer-to-peer hypermedia protocol',
		thumb_image_url: 'https://tea.xyz/Images/packages/ipfs_tech.jpg',
		installs: 0
	},
	{
		slug: 'nixos_org_patchelf',
		homepage: 'https://nixos.org',
		maintainer: 'nixos.org',
		name: 'patchelf',
		version: '0.15.0',
		last_modified: '2022-09-27T04:50:44.000Z',
		full_name: 'nixos.org/patchelf',
		dl_count: 0,
		thumb_image_name: 'nixos_org_patchelf_option 1.jpg ',
		desc: 'PatchELF is a simple utility for modifying existing ELF executables and libraries.',
		thumb_image_url: 'https://tea.xyz/Images/packages/nixos_org_patchelf.jpg',
		installs: 0
	},
	{
		slug: 'tea_xyz',
		homepage: 'https://tea.xyz',
		maintainer: 'tea.xyz',
		name: 'tea.xyz',
		version: '0.8.6',
		last_modified: '2022-10-19T19:13:51.000Z',
		full_name: 'tea.xyz',
		dl_count: 0,
		thumb_image_name: 'tea_xyz_option 2.jpg ',
		desc: 'Website of tea.xyz',
		thumb_image_url: 'https://tea.xyz/Images/packages/tea_xyz.jpg',
		installs: 0
	},
	{
		slug: 'charm_sh_gum',
		homepage: 'https://charm.sh',
		maintainer: 'charm.sh',
		name: 'gum',
		version: '0.8.0',
		last_modified: '2022-10-21T02:15:16.000Z',
		full_name: 'charm.sh/gum',
		dl_count: 0,
		thumb_image_name: 'charm_sh_gum.jpg ',
		desc: '',
		thumb_image_url: 'https://tea.xyz/Images/packages/charm_sh_gum.jpg',
		installs: 0
	},
	{
		slug: 'pyyaml_org',
		homepage: 'https://pyyaml.org',
		name: 'pyyaml.org',
		version: '0.2.5',
		last_modified: '2022-10-03T15:35:14.000Z',
		full_name: 'pyyaml.org',
		dl_count: 107505,
		thumb_image_name: 'pyyaml_org_option 1.jpg ',
		maintainer: '',
		desc: 'YAML framework for Python',
		thumb_image_url: 'https://tea.xyz/Images/packages/pyyaml_org.jpg',
		installs: 0
	},
	{
		slug: 'tea_xyz_gx_cc',
		homepage: 'https://tea.xyz',
		maintainer: 'tea.xyz',
		name: 'cc',
		version: '0.1.0',
		last_modified: '2022-10-19T16:47:44.000Z',
		full_name: 'tea.xyz/gx/cc',
		dl_count: 0,
		thumb_image_name: 'tea_xyz_gx.jpg ',
		desc: '',
		thumb_image_url: 'https://tea.xyz/Images/packages/tea_xyz_gx_cc.jpg',
		installs: 0
	}
];

export async function getPackages(): Promise<Package[]> {
	return packages;
}

export async function getFeaturedPackages(): Promise<Package[]> {
	return packages.slice(0, 4);
}

export async function getPackageReviews(full_name: string): Promise<Review[]> {
	console.log(`generating reviews for ${full_name}`);

	const reviewCount = _.random(7, 21);
	const reviews: Review[] = [];

	for (let i = 0; i < reviewCount; i++) {
		const title = loremIpsum({
			count: _.random(2, 5),
			format: 'plain',
			paragraphLowerBound: 3,
			paragraphUpperBound: 7,
			random: Math.random,
			sentenceLowerBound: 5,
			sentenceUpperBound: 15,
			units: 'words'
		});
		const comment = loremIpsum({
			count: 2,
			format: 'plain',
			paragraphLowerBound: 3,
			paragraphUpperBound: 7,
			random: Math.random,
			sentenceLowerBound: 5,
			sentenceUpperBound: 15,
			units: 'sentences'
		});
		const rating = _.random(0, 5);
		reviews.push({
			title,
			comment,
			rating
		});
	}

	return reviews;
}
