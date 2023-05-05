import { type AppUpdater, autoUpdater } from "electron-updater";
import log from "./logger";
import { MainWindowNotifier } from "./types";

type AutoUpdateStatus = {
  status: "up-to-date" | "available" | "ready";
  version?: string;
};

autoUpdater.logger = log;

let mainWindowNotifier: MainWindowNotifier | null = null;
let initalized = false;
let isUpdating = false;

// keep the last status to resend to the window when it's opened becuase the store is destroyed when the window is closed
let lastStatus: AutoUpdateStatus = { status: "up-to-date" };

export const getUpdater = () => autoUpdater;

export function checkUpdater(notifier: MainWindowNotifier): AppUpdater {
  try {
    mainWindowNotifier = notifier;
    checkForUpdates();

    if (!initalized) {
      initalized = true;

      setInterval(() => {
        checkForUpdates();
      }, 1000 * 60 * 30); // check for updates every 30 minutes
    }
  } catch (error) {
    log.error(error);
  }

  return autoUpdater;
}

const checkForUpdates = async () => {
  if (isUpdating) {
    log.info("Update is already in progress");
    return;
  }

  isUpdating = true;

  try {
    const result = await autoUpdater.checkForUpdatesAndNotify();
    if (!result?.downloadPromise) {
      isUpdating = false;
    } else {
      const files = await result.downloadPromise;
      log.info("Successfully downloaded update files:", files);
      // DO NOT RESET isUpdating here because the user still needs to click to install it
      // and we don't want to accidentally start another update and overwrite the file
    }
  } catch (err) {
    log.error("Error checking for updates:", err);
    isUpdating = false;
  }
};

// The auto update runs in the background so the window might not be open when the status changes
// When the update store gets created as part of the window it will request the latest status.
export function getAutoUpdateStatus() {
  return lastStatus;
}

function sendStatusToWindow(status: AutoUpdateStatus) {
  lastStatus = status;
  if (mainWindowNotifier) {
    mainWindowNotifier("app-update-status", status);
  }
}

autoUpdater.on("checking-for-update", () => {
  log.info("checking for tea gui update");
});

autoUpdater.on("update-available", (info) => {
  log.info("update-available", info);
  sendStatusToWindow({ status: "available" });
});

autoUpdater.on("update-not-available", () => {
  log.info("no update for tea gui");
  sendStatusToWindow({ status: "up-to-date" });
});

autoUpdater.on("error", (err) => {
  log.error("auto update:", err);
});

autoUpdater.on("download-progress", (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message = log_message + " (" + progressObj.transferred + "/" + progressObj.total + ")";
  log.info("tea gui:", log_message);
});

autoUpdater.on("update-downloaded", (info) => {
  log.info("update-downloaded");
  sendStatusToWindow({ status: "ready", version: info.version });
});
