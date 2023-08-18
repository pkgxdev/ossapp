import axios from "axios";
import type { Contributor, Package } from "$libs/types";
import yaml from "js-yaml";
export async function getPackageYaml(pkgYamlUrl: string) {
  const url = pkgYamlUrl.replace("/github.com", "/raw.githubusercontent.com").replace("/blob", "");

  const { data: rawYaml } = await axios.get(url);

  const data = await yaml.load(rawYaml);

  return data;
}

export async function getReadme({
  owner,
  repo,
  project
}: {
  owner: string;
  repo: string;
  project: string;
}): Promise<{ data: string; type: "md" | "rst" | "html" }> {
  let type: "md" | "rst" | "html" = "md";
  let data = "";

  const [reqGithub, reqHTML] = await Promise.all([
    axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`),
    axios.get(`https://gui.tea.xyz/dev/${project}/readme.html`)
  ]);

  if (reqHTML.status === 200) {
    type = "html";
    data = reqHTML.data;
  } else if (reqGithub.data?.download_url) {
    type = reqGithub.data.name.endsWith(".rst") ? "rst" : "md";
    const reqDl = await axios.get(reqGithub.data.download_url);
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
  const gh = slug.replace("https://github.com/", "");
  const [owner, repo] = gh.split("/");
  return [owner, repo].join("/");
};
