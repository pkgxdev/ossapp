import { spawn } from "child_process";
import { getGuiPath, getTeaPath } from "./tea-dir";
import fs from "fs";
import path from "path";
import { hooks } from "@teaxyz/lib";

import log from "./logger";
import { MainWindowNotifier } from "./types";
import { Installation, porcelain } from "@teaxyz/lib";
import type { Resolution } from "@teaxyz/lib/script/src/plumbing/resolve";
import { GUIPackage } from "../../svelte/src/libs/types";
import { getPantryDetails } from "./pantry";
import { app } from "electron";

export async function installPackage(
  full_name: string,
  version: string,
  notifyMainWindow: MainWindowNotifier
) {
  const notifier = newInstallProgressNotifier(full_name, notifyMainWindow);

  const qualifedPackage = `${full_name}@${version}`;
  log.info(`installing package ${qualifedPackage}`);
  const result = await porcelain.install(qualifedPackage, notifier);
  log.info(`successfully installed ${qualifedPackage}`, result);
}

function newInstallProgressNotifier(full_name: string, notifyMainWindow: MainWindowNotifier) {
  return {
    resolved: ({ pending }: Resolution) => {
      log.info(`resolved ${pending.length} packages to install`);
    },
    progress: (progress: number) => {
      if (progress > 0 && progress <= 1) {
        notifyMainWindow("install-progress", {
          full_name,
          progress: progress * 100
        });
      }
    },
    installed: (installation: Installation) => {
      log.info("installed", installation);
      const { project, version } = installation.pkg;
      notifyMainWindow("pkg-installed", {
        full_name: project,
        version: version.toString()
      });
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

export async function openPackageEntrypointInTerminal(pkg: GUIPackage) {
  const cliBinPath = await installTeaCli();
  // look up the entrypoint for the package again in case it changed. This makes
  // hacking on the entrypoint more ergonomic
  const { entrypoint } = await getPantryDetails(pkg.full_name);

  let sh = "sh";
  if (entrypoint) {
    sh = path.join(getTeaPath(), `${pkg.full_name}/v*`, entrypoint);
  }

  const cmd = `"${cliBinPath}" --env=false +${pkg.full_name} "${sh}"`;
  log.info(`opening package ${pkg.full_name} in terminal with command: ${cmd}`);

  const scriptPath = await createCommandScriptFile(cmd);
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

// add more config files here to support more shells
const envConfigPaths = [".bashrc", ".zshrc", ".zprofile", ".config/fish/config.fish", ".login"];

export async function isMagicEnabled(): Promise<boolean> {
  let isEnabled = false;
  log.info("checking if magic is enabled....");
  // TODO: figure out which terminal env is actually being used by the user?
  for (const file of envConfigPaths) {
    try {
      const configPath = path.join(app.getPath("home"), file);
      log.info("checking if magic is enabled in", configPath);
      if (fs.existsSync(configPath)) {
        const config = await fs.readFileSync(configPath, "utf-8");
        if (config.includes("export TEA_MAGIC=prompt") || config.includes("export TEA_MAGIC=1")) {
          isEnabled = true;
          break;
        }
      }
      log.info("not enabled!");
    } catch (error) {
      log.error(error);
    }
  }
  return isEnabled;
}

export async function enableMagic() {
  log.info("enabling magic....");
  // TODO: figure out which terminal env is actually being used by the user? to avoid spam env settings
  for (const file of envConfigPaths) {
    try {
      const configPath = path.join(app.getPath("home"), file);
      if (fs.existsSync(configPath)) {
        let config = await fs.readFileSync(configPath, "utf-8");
        const hasMagic0 = config.includes("export TEA_MAGIC=0");
        if (hasMagic0) {
          config = config.replace(/TEA_MAGIC=0/g, "TEA_MAGIC=prompt");
          await fs.writeFileSync(configPath, config);
        } else {
          await fs.appendFileSync(configPath, "\nexport TEA_MAGIC=prompt\n");
        }
      }
    } catch (error) {
      log.error(error);
    }
  }
  log.info("magic enabled");
}

export async function disableMagic() {
  log.info("enabling magic....");
  // TODO: figure out which terminal env is actually being used by the user? to avoid spam env settings
  for (const file of envConfigPaths) {
    try {
      const configPath = path.join(app.getPath("home"), file);
      if (fs.existsSync(configPath)) {
        const config = await fs.readFileSync(configPath, "utf-8");
        if (config.includes("TEA_MAGIC=prompt") || config.includes("TEA_MAGIC=1")) {
          const updatedConfig = config
            .replace(/TEA_MAGIC=prompt/g, "TEA_MAGIC=0")
            .replace(/TEA_MAGIC=1/g, "TEA_MAGIC=0");
          await fs.writeFileSync(configPath, updatedConfig);
        }
      }
    } catch (error) {
      log.error(error);
    }
  }
  log.info("magic disabled");
}
