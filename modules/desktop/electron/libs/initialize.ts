import fs from "fs";
import { getGuiPath, getTeaPath } from "./tea-dir";
import log from "./logger";
import semver from "semver";
import { cliBinPath, asyncExec } from "./cli";
import { createInitialSessionFile } from "./auth";
import * as https from "https";
import { spawn } from "child_process";
import path from "path";

let initializePromise: Promise<string> | null = null;

export async function initializeTeaCli(): Promise<string> {
  // contract: cannot be called off the main web worker thread
  const teaCliPrefix = path.join(getTeaPath(), "tea.xyz/v*");

  if (initializePromise && fs.existsSync(path.join(teaCliPrefix, "bin/tea"))) {
    return initializePromise;
  }

  log.info("Initializing tea cli");
  initializePromise = initializeTeaCliInternal(teaCliPrefix);

  initializePromise.catch((error) => {
    log.info("Error initializing tea cli, resetting promise:", error);
    initializePromise = null;
  });

  return initializePromise;
}

async function initializeTeaCliInternal(teaCliPrefix: string): Promise<string> {
  if (!fs.existsSync(path.join(teaCliPrefix, "bin/tea"))) {
    return installTeaCli();
  } else {
    const dir = fs.readlinkSync(teaCliPrefix);
    const v = semver.parse(dir)?.toString();
    if (!v) throw new Error(`couldn't parse to semver: ${dir}`);
    return v;
  }
}

//NOTE copy pasta from https://github.com/teaxyz/setup/blob/main/action.js
//FIXME ideally we'd not copy pasta this
//NOTE using `tar` is not ideal ∵ Windows and even though tar is POSIX it's still not guaranteed to be available
async function installTeaCli() {
  const PREFIX = `${process.env.HOME}/.tea`;

  const midfix = (() => {
    switch (process.arch) {
      case "arm64":
        return `${process.platform}/aarch64`;
      case "x64":
        return `${process.platform}/x86-64`;
      default:
        throw new Error(`unsupported platform: ${process.platform}/${process.arch}`);
    }
  })();

  /// versions.txt is guaranteed semver-sorted
  const v: string | undefined = await new Promise((resolve, reject) => {
    https
      .get(`https://dist.tea.xyz/tea.xyz/${midfix}/versions.txt`, (rsp) => {
        if (rsp.statusCode != 200) return reject(rsp.statusCode);
        rsp.setEncoding("utf8");
        const chunks: string[] = [];
        rsp.on("data", (x) => chunks.push(x));
        rsp.on("end", () => {
          resolve(chunks.join("").trim().split("\n").at(-1));
        });
      })
      .on("error", reject);
  });

  if (!v) throw new Error(`invalid versions.txt for tea/cli`);

  fs.mkdirSync(PREFIX, { recursive: true });

  const exitcode = await new Promise((resolve, reject) => {
    https
      .get(`https://dist.tea.xyz/tea.xyz/${midfix}/v${v}.tar.gz`, (rsp) => {
        if (rsp.statusCode != 200) return reject(rsp.statusCode);
        const tar = spawn("tar", ["xzf", "-"], {
          stdio: ["pipe", "inherit", "inherit"],
          cwd: PREFIX
        });
        rsp.pipe(tar.stdin);
        tar.on("close", resolve);
      })
      .on("error", reject);
  });

  if (exitcode != 0) {
    throw new Error(`tar: ${exitcode}`);
  }

  const oldwd = process.cwd();
  process.chdir(`${PREFIX}/tea.xyz`);
  if (fs.existsSync(`v*`)) fs.unlinkSync(`v*`);
  fs.symlinkSync(`v${v}`, `v*`, "dir");
  if (fs.existsSync(`v0`)) fs.unlinkSync(`v0`);
  fs.symlinkSync(`v${v}`, `v0`, "dir"); //FIXME
  process.chdir(oldwd);

  return v;
}

export default async function initialize(): Promise<string> {
  const [version] = await Promise.all([initializeTeaCli(), createInitialSessionFile()]);
  return version;
}
