import axios from "axios";
import type { Contributor, GUIPackage, Package } from "$libs/types";
import yaml from "js-yaml";
import { isDev } from "@native";
import log from "./logger";
import { GUIBaseURL } from "./constants";
export async function getPackageYaml(pkgYamlUrl: string) {
  const url = pkgYamlUrl.replace("/github.com", "/raw.githubusercontent.com").replace("/blob", "");

  const { data: rawYaml } = await axios.get(url);

  const data = await yaml.load(rawYaml);

  return data;
}

export async function getReadme(
  pkg: Partial<GUIPackage>
): Promise<{ data: string; type: "md" | "rst" | "html" }> {
  let type: "md" | "rst" | "html" = "md";
  let data = "";
  try {
    const stage = (await isDev()) ? "dev" : "prod";
    const reqHTML = await axios.get(`https://${GUIBaseURL}/${stage}/${pkg.full_name!}/readme.html`);
    if (reqHTML.status === 200 && reqHTML.data) {
      return {
        data: reqHTML.data,
        type: "html"
      };
    }

    const repo = repoCloudProvider(pkg.github_url!);
    const { namespace, projectName } = getNamespaceProject(pkg.github_url!); // TODO: replace with repo_url

    if (repo.isGithub) {
      const reqGithub = await axios.get(
        `https://api.github.com/repos/${namespace}/${projectName}/readme`
      );
      type = reqGithub.data.name.endsWith(".rst") ? "rst" : "md";
      const reqDl = await axios.get(reqGithub.data.download_url);
      data = reqDl.data;
    } else if (repo.isGitlab) {
      const gitlabApiUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(
        namespace + "/" + projectName
      )}`;
      const reqForId = await axios.get(gitlabApiUrl);
      const projectId = reqForId.data.id;
      const reqGitlab = await axios.get(
        `https://gitlab.com/api/v4/projects/${projectId}/repository/files/README.md/raw`
      );
      data = reqGitlab.data;
    }
  } catch (error) {
    log.error(error);
  }
  return { data, type };
}

export async function getContributors(pkg: Pick<GUIPackage, "github_url">): Promise<Contributor[]> {
  // TODO: replace with repo_url
  // TODO: work with gitlab api GET /projects/:id/repository/contributors or index this in the db too
  const { namespace, projectName } = getNamespaceProject(pkg.github_url!);
  // maintainer/repo
  let contributors: Contributor[] = [];
  try {
    const repo = repoCloudProvider(pkg.github_url!);
    if (repo.isGithub) {
      const req = await axios.get(
        `https://api.github.com/repos/${namespace}/${projectName}/contributors`
      );
      if (req.data) {
        contributors = req.data.map((c: Contributor & { id: number }) => ({
          login: c.login,
          avatar_url: c.avatar_url,
          name: c.name || "",
          github_id: c.id,
          contributions: c.contributions
        }));
      }
    }
  } catch (error) {
    log.error(error);
  }
  return contributors;
}

export async function getRepoAsPackage(
  pkg: Pick<GUIPackage, "github_url">
): Promise<Partial<Package>> {
  const { namespace, projectName } = getNamespaceProject(pkg.github_url!);

  const newPkg: Partial<Package> = {};
  try {
    const repo = repoCloudProvider(pkg.github_url!);
    if (repo.isGithub) {
      const req = await axios.get(`https://api.github.com/repos/${namespace}/${projectName}`);
      if (req.data) {
        newPkg.license = req.data?.license?.name || "";
      }
    }
  } catch (error) {
    log.error(error);
  }
  return newPkg;
}

export const trimGithubSlug = (slug: string): string => {
  const gh = slug.replace("https://github.com/", "");
  const [owner, repo] = gh.split("/");
  return [owner, repo].join("/");
};

export const getNamespaceProject = (repoURL: string) => {
  const parsedUrl = new URL(repoURL);
  const pathParts = parsedUrl.pathname.split("/").filter((part) => part);
  const namespace = pathParts[0];
  const projectName = pathParts[1];
  return {
    namespace,
    projectName
  };
};

export const getRepoLabel = (repoURL: string) => {
  const { namespace, projectName } = getNamespaceProject(repoURL);
  return `${namespace}/${projectName}`;
};

export const repoCloudProvider = (repoURL: string) => {
  return {
    isGithub: repoURL.includes("github.com"),
    isGitlab: repoURL.includes("gitlab")
  };
};
