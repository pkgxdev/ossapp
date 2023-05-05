// import { readDir, BaseDirectory } from '@tauri-apps/api/fs';
import fs from "fs";
import path from "path";
import { app } from "electron";
import log from "./logger";
import type { InstalledPackage } from "../../src/libs/types";
import { mkdirp } from "mkdirp";
import fetch from "node-fetch";
import { SemVer, isValidSemVer } from "@tea/libtea";

type Dir = {
  name: string;
  path: string;
  children?: Dir[];
};

type ParsedVersion = { full_name: string; semVer: SemVer };

export const getTeaPath = () => {
  const homePath = app.getPath("home");
  const teaPath = path.join(homePath, "./.tea");
  return teaPath;
};

const guiFolder = path.join(getTeaPath(), "tea.xyz/gui");

export const getGuiPath = () => {
  return path.join(getTeaPath(), "tea.xyz/gui");
};

export async function getInstalledPackages(): Promise<InstalledPackage[]> {
  const pkgsPath = getTeaPath();
  log.info("recursively reading:", pkgsPath);
  const folders = await deepReadDir({
    dir: pkgsPath,
    continueDeeper: (name: string) => !isValidSemVer(name) && name !== ".tea",
    filter: (name: string) => !!isValidSemVer(name) && name !== ".tea"
  });

  const bottles = folders
    .map((p: string) => p.split(".tea/")[1])
    .map(parseVersionFromPath)
    .filter((v): v is ParsedVersion => !!v)
    .sort((a, b) => b.semVer.compare(a.semVer));

  log.info("installed bottles:", bottles.length);

  return bottles.reduce<InstalledPackage[]>((pkgs, bottle) => {
    const pkg = pkgs.find((v) => v.full_name === bottle.full_name);
    if (pkg) {
      pkg.installed_versions.push(bottle.semVer.toString());
    } else {
      pkgs.push({
        full_name: bottle.full_name,
        installed_versions: [bottle.semVer.toString()]
      });
    }
    return pkgs;
  }, []);
}

const parseVersionFromPath = (versionPath: string): ParsedVersion | null => {
  try {
    const path = versionPath.trim().split("/");
    const version = path.pop();
    return {
      semVer: new SemVer(version ?? ""),
      full_name: path.join("/")
    };
  } catch (e) {
    log.error("error parsing version from path: ", versionPath);
    return null;
  }
};

const semverTest =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/g;

export const getPkgBottles = (packageDir: Dir): string[] => {
  log.info("getting installed bottle for ", packageDir);
  const bottles: string[] = [];

  const pkg = packageDir.path.split(".tea/")[1];
  const version = pkg.split("/v")[1];

  const isVersion = semverTest.test(version) || !isNaN(+version) || version === "*";

  if (version && isVersion) {
    bottles.push(pkg);
  } else if (packageDir?.children?.length) {
    const childBottles = packageDir.children
      .map(getPkgBottles)
      .reduce((arr, bottles) => [...arr, ...bottles], []);
    bottles.push(...childBottles);
  }

  const foundBottles = bottles.filter((b) => b !== undefined).sort(); // ie: ["gohugo.io/v*", "gohugo.io/v0", "gohugo.io/v0.108", "gohugo.io/v0.108.0"]

  log.info(`Found ${foundBottles.length} bottles from `, packageDir);
  return foundBottles;
};

export const deepReadDir = async ({
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
      } else if (!f.isSymbolicLink() && filter && filter(f.name)) {
        arrayOfFiles.push(nextPath);
      } else if (!f.isSymbolicLink() && !filter) {
        arrayOfFiles.push(nextPath);
      }
    }
  } catch (e) {
    log.error(e);
  }
  return arrayOfFiles;
};

const listFilePath = path.join(getGuiPath(), "installed.json");
export const getPackagesInstalledList = async (): Promise<InstalledPackage[]> => {
  let list: InstalledPackage[] = [];
  try {
    if (fs.existsSync(listFilePath)) {
      log.info("gui/installed.json file exists!");
      const listBuffer = await fs.readFileSync(listFilePath);
      list = JSON.parse(listBuffer.toString()) as InstalledPackage[];
    } else {
      log.info("gui/installed.json does not exists!");
      await mkdirp(guiFolder);
      await updatePackageInstalledList([]);
    }
  } catch (error) {
    log.error(error);
  }
  return list;
};

export async function updatePackageInstalledList(list: InstalledPackage[]) {
  try {
    log.info("creating:", listFilePath);
    await mkdirp(guiFolder);
    await fs.writeFileSync(listFilePath, JSON.stringify(list), {
      encoding: "utf-8"
    });
  } catch (error) {
    log.error(error);
  }
}

export async function deletePackageFolder(fullName, version) {
  try {
    const foldPath = path.join(getTeaPath(), fullName, `v${version}`);
    log.info("rm:", foldPath);
    await fs.rmdirSync(foldPath, { recursive: true });
  } catch (error) {
    log.error(error);
  }
}

async function downloadImage(url: string, imagePath: string): Promise<void> {
  const response = await fetch(url);
  await new Promise<void>((resolve, reject) => {
    const fileStream = fs.createWriteStream(imagePath);
    response.body.pipe(fileStream);
    fileStream.on("finish", () => resolve());
    fileStream.on("error", (error) => reject(error));
  });
}

export async function cacheImage(url: string): Promise<string> {
  const imageFolder = path.join(getGuiPath(), "cached_images");
  const imageName = path.basename(url);
  const imagePath = path.join(imageFolder, imageName);

  await mkdirp(imageFolder);

  if (!fs.existsSync(imagePath)) {
    try {
      await downloadImage(url, imagePath);
      console.log("Image downloaded and cached:", imagePath);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  } else {
    console.log("Image already cached:", imagePath);
  }

  return `file://${imagePath}`;
}
