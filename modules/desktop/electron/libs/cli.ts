import { spawn } from "child_process";
import { getGuiPath } from "./tea-dir";
import fs from "fs";
import path from "path";
import { hooks } from "@teaxyz/lib";

import log from "./logger";
import { MainWindowNotifier } from "./types";
import { Installation, Package, porcelain } from "@teaxyz/lib";
import type { Resolution } from "@teaxyz/lib/script/src/plumbing/resolve";

export async function installPackage(
  full_name: string,
  version: string,
  notifyMainWindow: MainWindowNotifier
) {
  const notifier = newInstallProgressNotifier(full_name, notifyMainWindow);

  const qualifedPackage = `${full_name}@${version}`;
  log.info(`installing package ${qualifedPackage}`);
  const result = await porcelain.install(qualifedPackage, notifier);
  console.log(`successfully installed ${qualifedPackage}`, result);
}

function newInstallProgressNotifier(full_name: string, notifyMainWindow: MainWindowNotifier) {
  // the totall number of packages to install - this is set by the "resolved" message
  let numberOfPackages = 1;

  // the current package number - this is incremented by the "installed" or "downloaded" message
  let currentPackageNumber = 0;

  return {
    resolved: ({ pending }: Resolution) => {
      numberOfPackages = pending.length ?? 1;
      log.info(`resolved ${numberOfPackages} packages to install`);
    },
    installing: ({ pkg, progress }: { pkg: Package; progress: number | undefined }) => {
      log.info(`installing ${pkg.project}@${pkg.version} - ${progress}`);
      if (progress && progress > 0) {
        // how many total packages are completed
        const completedProgress = (currentPackageNumber / numberOfPackages) * 100;
        // overallProgress is the total packages completed plus the percentage of the current package
        const overallProgress = completedProgress + (progress / numberOfPackages) * 100;
        notifyMainWindow("install-progress", { full_name, progress: overallProgress });
      }
    },
    installed: (installation: Installation) => {
      log.info("installed", installation);
      const { project, version } = installation.pkg;

      currentPackageNumber++;
      const progress = (currentPackageNumber / numberOfPackages) * 100;
      notifyMainWindow("install-progress", { full_name, progress });
      notifyMainWindow("pkg-installed", { full_name: project, version: version.toString() });
    }
  };
}

// the tea cli package is needed to open any other package in the terminal, so make sure it's installed and return the path
async function installTeaCli() {
  const installations = await porcelain.install("tea.xyz");
  const teaPkg = installations.find((i) => i.pkg.project === "tea.xyz");
  if (!teaPkg) {
    throw new Error("could not find or install tea cli!");
  }

  return teaPkg.path.join("bin/tea");
}

export async function openPackageEntrypointInTerminal(pkg: string) {
  const cliBinPath = await installTeaCli();
  log.info(`opening package ${pkg} with tea cli at ${cliBinPath}`);

  let sh = `"${cliBinPath}" --sync --env=false +${pkg} `;
  switch (pkg) {
    case "github.com/AUTOMATIC1111/stable-diffusion-webui":
      sh += `~/.tea/${pkg}/v*/entrypoint.sh`;
      break;
    case "cointop.sh":
      sh += "cointop";
      break;
    default:
      sh += "sh";
  }

  const scriptPath = await createCommandScriptFile(sh);

  try {
    let stdout = "";
    let stderr = "";

    await new Promise((resolve, reject) => {
      const child = spawn("/usr/bin/osascript", [scriptPath]);
      child.stdout.on("data", (data) => {
        stdout += data.toString().trim();
      });
      child.stderr.on("data", (data) => {
        stderr += data.toString().trim();
      });

      child.on("exit", (code) => {
        log.info("exit:", code, `\`${stdout}\``);
        if (code == 0) {
          resolve(stdout);
        } else {
          reject(new Error("failed to open terminal and run tea sh"));
        }
      });

      child.on("error", () => {
        reject(new Error(stderr));
      });
    });
  } finally {
    if (scriptPath) await fs.unlinkSync(scriptPath);
  }
}

const createCommandScriptFile = async (cmd: string): Promise<string> => {
  const guiFolder = getGuiPath();
  const tmpFilePath = path.join(guiFolder, `${+new Date()}.scpt`);
  const command = `${cmd.replace(/"/g, '\\"')}`;
  const script = `
    tell application "Terminal"
      activate
      do script "${command}"
    end tell
  `.trim();

  await fs.writeFileSync(tmpFilePath, script, "utf-8");
  return tmpFilePath;
};

export async function syncPantry() {
  log.info("syncing pantry");
  await hooks.useSync();
  log.info("syncing pantry completed");
}

const envConfigPaths = [".bashrc", ".zshrc", ".zprofile", ".config/fish/config.fish", ".login"];

export async function isMagicEnabled(): Promise<boolean> {
  // 0. loop through envConfigPaths
  // 1. check if TEA_MAGIC is set to prompt or 1
  return false;
}

export async function enableMagic() {
  // 0. detect if tea-cli is installed
  // 1. spam all envConfigPaths with `export TEA_MAGIC=prompt`
}
