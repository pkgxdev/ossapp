import axios from 'axios';
const yaml = window.require('yaml');

export async function getGithubOwnerRepo(
	pkgYamlUrl: string
): Promise<{ owner: string; repo: string }> {
	// https://github.com/teaxyz/pantry.core/blob/main/projects/sqlite.org/package.yml
	// https://raw.githubusercontent.com/teaxyz/pantry.core/main/projects/sqlite.org/package.yml
	let owner = '';
	let repo = '';

	const url = pkgYamlUrl.replace('/github.com', '/raw.githubusercontent.com').replace('/blob', '');

	const { data: rawYaml } = await axios.get(url);

	const data = await yaml.parse(rawYaml);
	if (data?.versions?.github) {
		[owner, repo] = data.versions.github.split('/').filter((b: string) => b);
	}

	return {
		owner,
		repo
	};
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
