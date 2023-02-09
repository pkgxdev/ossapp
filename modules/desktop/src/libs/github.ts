import axios from 'axios';
import type { Contributor } from '@tea/ui/types';
const yaml = window.require('yaml');

export async function getPackageYaml(pkgYamlUrl: string) {
	const url = pkgYamlUrl.replace('/github.com', '/raw.githubusercontent.com').replace('/blob', '');

	const { data: rawYaml } = await axios.get(url);

	const data = await yaml.parse(rawYaml);

	return data;
}

export async function getReadme(owner: string, repo: string): Promise<string> {
	let readme = '';
	const req = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`);
	if (req.data?.download_url) {
		const reqDl = await axios.get(req.data.download_url);
		readme = reqDl.data;
	}
	return readme;
}

export async function getContributors(owner: string, repo: string): Promise<Contributor[]> {
	// maintainer/repo
	let contributors: Contributor[] = [];
	const req = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`);
	if (req.data) {
		contributors = req.data.map((c: Contributor & { id: number }) => ({
			login: c.login,
			avatar_url: c.avatar_url,
			name: c.name || '',
			github_id: c.id,
			contributions: c.contributions
		}));
	}
	return contributors;
}
