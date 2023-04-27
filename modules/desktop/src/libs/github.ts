import axios from "axios";
import type { Contributor, Package } from "@tea/ui/types";
import yaml from "js-yaml";
export async function getPackageYaml(pkgYamlUrl: string) {
	const url = pkgYamlUrl.replace("/github.com", "/raw.githubusercontent.com").replace("/blob", "");

	const { data: rawYaml } = await axios.get(url);

	const data = await yaml.load(rawYaml);

	return data;
}

export async function getReadme(
	owner: string,
	repo: string
): Promise<{ data: string; type: "md" | "rst" }> {
	let type: "md" | "rst" = "md";
	let data = "";
	const req = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`);

	if (req.data?.download_url) {
		type = req.data.name.endsWith(".rst") ? "rst" : "md";
		const reqDl = await axios.get(req.data.download_url);
		data = reqDl.data;
	}
	return { data, type };
}

export async function getContributors(owner: string, repo: string): Promise<Contributor[]> {
	// maintainer/repo
	let contributors: Contributor[] = [];
	const req = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`);
	if (req.data) {
		contributors = req.data.map((c: Contributor & { id: number }) => ({
			login: c.login,
			avatar_url: c.avatar_url,
			name: c.name || "",
			github_id: c.id,
			contributions: c.contributions
		}));
	}
	return contributors;
}

export async function getRepoAsPackage(owner: string, repo: string): Promise<Partial<Package>> {
	const req = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
	const pkg: Partial<Package> = {};
	if (req.data) {
		pkg.license = req.data?.license?.name || "";
	}
	return pkg;
}

export const trimGithubSlug = (slug: string): string => {
	const [owner, repo] = slug.split("/");
	return [owner, repo].join("/");
};
