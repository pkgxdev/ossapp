import { ipcMain, app, BrowserWindow } from "electron";
import {
  deletePackageFolder,
  getInstalledPackages,
  getInstalledVersionsForPackage,
  cacheImage,
  startMonitoringTeaDir,
  stopMonitoringTeaDir
} from "./tea-dir";
import { readSessionData, writeSessionData, pollAuth } from "./auth";
import type { Packages, Session } from "../../src/libs/types";
import log from "./logger";
import { syncLogsAt } from "./v1-client";
import { installPackage, openPackageEntrypointInTerminal, syncPantry } from "./cli";

import { getAutoUpdateStatus, getUpdater, isDev } from "./auto-updater";

import { loadPackageCache, writePackageCache } from "./package";
import { nanoid } from "nanoid";
import { MainWindowNotifier } from "./types";
import { unsubscribeToPackageTopic } from "./push-notification";
import { getHeaders } from "./v1-client";

export type HandlerOptions = {
  // A function to call back to the current main
  notifyMainWindow: MainWindowNotifier;
};

let teaProtocolPath = ""; // this should be empty string
export const setProtocolPath = (path: string) => {
  teaProtocolPath = path;
};

export default function initializeHandlers({ notifyMainWindow }: HandlerOptions) {
  ipcMain.handle("get-installed-packages", async () => {
    try {
      log.info("getting installed packages");
      const pkgs = await getInstalledPackages();
      log.info(`got installed packages: ${pkgs.length}`);
      return pkgs;
    } catch (error) {
      log.error(error);
      return [];
    }
  });

  ipcMain.handle("get-installed-package-versions", async (_, fullName: string) => {
    try {
      log.info(`getting installed versions for package: ${fullName}`);
      return await getInstalledVersionsForPackage(fullName);
    } catch (error) {
      log.error(error);
      return error;
    }
  });

  ipcMain.handle("get-session", async () => {
    try {
      log.info("getting session");
      const session = await readSessionData();
      log.debug(session ? "found session data" : "no session data found");
      return session;
    } catch (error) {
      log.error(error);
      return {};
    }
  });

  ipcMain.handle("update-session", async (_, data) => {
    try {
      log.info("updating session data with", data); // rm this
      await writeSessionData(data as Session);
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle("install-package", async (_, { full_name, version }) => {
    try {
      return await installPackage(full_name, version, notifyMainWindow);
    } catch (error) {
      log.error(error);
      return error;
    }
  });

  ipcMain.handle("sync-pantry", async () => {
    try {
      return await syncPantry();
    } catch (error) {
      log.error(error);
      return error;
    }
  });

  ipcMain.handle("open-terminal", async (_, data) => {
    const { pkg } = data as { pkg: string };
    try {
      // TODO: detect if mac or linux
      // current openTerminal is only design for Mac
      log.info("open tea entrypoint in terminal for pkg:", pkg);
      await openPackageEntrypointInTerminal(pkg);
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle("relaunch", async () => {
    try {
      log.info("relaunching app");
      const autoUpdater = getUpdater();
      setImmediate(() => {
        autoUpdater.quitAndInstall();
      });
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle("get-protocol-path", async () => {
    const path = teaProtocolPath;
    teaProtocolPath = "";
    return path;
  });

  ipcMain.handle("submit-logs", async () => {
    try {
      log.info("syncing logs");
      const { device_id } = await readSessionData();
      const logId = [device_id, nanoid()].join("---");

      // sync in background
      syncLogsAt(logId)
        .then(() => {
          log.info("logs synced:", logId);
        })
        .catch((error) => {
          log.error(error);
        });

      return logId;
    } catch (error) {
      log.error(error);
      return error.message;
    }
  });

  ipcMain.handle("set-badge-count", async (_, { count }) => {
    if (count) {
      app.dock.setBadge(count.toString());
    } else {
      app.dock.setBadge("");
    }
  });

  ipcMain.handle(
    "delete-package",
    async (_, { fullName, version }: { fullName: string; version: string }) => {
      try {
        log.info("deleting package:", fullName);
        await deletePackageFolder(fullName, version);
        const { installed_versions } = await getInstalledVersionsForPackage(fullName);
        if (installed_versions.length === 0) {
          await unsubscribeToPackageTopic(fullName);
        }
      } catch (e) {
        log.error(e);
      }
    }
  );

  ipcMain.handle("write-package-cache", async (_, data) => {
    try {
      await writePackageCache(data as Packages);
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle("load-package-cache", async () => {
    try {
      return await loadPackageCache();
    } catch (error) {
      log.error(error);
      return { version: "1", packages: {} };
    }
  });

  ipcMain.handle("topbar-double-click", async (event: Electron.IpcMainInvokeEvent) => {
    const mainWindow = BrowserWindow.fromWebContents(event.sender);
    if (mainWindow) {
      mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
    }
  });

  ipcMain.handle("cache-image", async (_event, url) => {
    try {
      if (process.env.NODE_ENV === "test") return url;
      log.info("caching:", url);
      const cachedImagePath = await cacheImage(url);
      return cachedImagePath;
    } catch (error) {
      log.error("Failed to cache image:", error);
      throw error;
    }
  });

  ipcMain.handle("get-auto-update-status", async () => {
    try {
      log.info("getting auto update status");
      return getAutoUpdateStatus();
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle("poll-session", async () => {
    try {
      log.info("start polling");
      return pollAuth();
    } catch (error) {
      log.error(error);
    }
  });

  ipcMain.handle("is-dev", async () => {
    try {
      return isDev();
    } catch (error) {
      log.error(error);
      return false;
    }
  });

  ipcMain.handle("monitor-tea-dir", async () => {
    try {
      await startMonitoringTeaDir(notifyMainWindow);
    } catch (err) {
      log.error("Failed to monitor tea dir", err);
      return err;
    }
  });

  ipcMain.handle("stop-monitor-tea-dir", async () => {
    try {
      await stopMonitoringTeaDir();
    } catch (err) {
      log.error("Failed to stop monitoring tea dir", err);
      return err;
    }
  });

  ipcMain.handle("get-api-headers", async (_event, path: string) => {
    try {
      const session = await readSessionData();
      return await getHeaders(path, session);
    } catch (error) {
      log.error(error);
      return {};
    }
  });
}
