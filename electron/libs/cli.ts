import { hooks } from "libpkgx";

import log from "./logger";
import { MainWindowNotifier } from "./types";
import * as tea from "libpkgx";
import { Installation } from "libpkgx";
import type { Resolution } from "libpkgx/script/src/plumbing/resolve";

export async function installPackage(
  full_name: string,
  version: string,
  notifyMainWindow: MainWindowNotifier
) {
  const notifier = newInstallProgressNotifier(full_name, notifyMainWindow);

  const qualifedPackage = `${full_name}@${version}`;
  log.info(`installing package ${qualifedPackage}`);
  const result = await tea.porcelain.install(qualifedPackage, notifier);
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

export async function syncPantry() {
  log.info("syncing pantry");
  await hooks.useSync();
  log.info("syncing pantry completed");
}
