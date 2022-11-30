/**
 * this is the main api integration, anything added here
 * should be mock replicated in ./mock.ts
 *  why? to make it easier to verify features without us always
 *    going through
 *      the build->download->install->test loop
 *      thus saving us so much time
 *
 * primary concerns here are any method that does the following:
 *  - connect to remote api(api.tea.xyz) and returns a data
 *  - connect to a local platform api and returns a data
 */
import { getClient } from '@tauri-apps/api/http';
import { Buffer } from 'buffer';
import type { Package } from '../types';
import * as mock from './mock';

const username = 'user';
const password = 'password';
const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

const base = 'https://api.tea.xyz/v1';

async function get<T>(path: string) {
	const client = await getClient();
	const uri = join(base, path);
	const { data } = await client.get<T>(uri.toString(), {
		headers: {
			Authorization: auth
		}
	});
	return data;
}

const join = function (...paths: string[]) {
	return paths
		.map(function (path) {
			if (path[0] === '/') {
				path = path.slice(1);
			}
			if (path[path.length - 1] === '/') {
				path = path.slice(0, path.length - 1);
			}
			return path;
		})
		.join('/');
};

export async function getPackages(): Promise<Package[]> {
	const packages = await get<Package[]>('packages');
	return packages;
}

export async function getFeaturedPackages(): Promise<Package[]> {
	const packages = await mock.getFeaturedPackages();
	return packages;
}
