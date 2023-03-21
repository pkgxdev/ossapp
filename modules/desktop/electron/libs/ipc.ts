import { ipcMain } from "electron";

import { getInstalledPackages } from "./tea-dir";
import { readSessionData, writeSessionData } from "./auth";
import type { Session } from "../../src/libs/types";
import * as log from "electron-log";

import { installPackage, openTerminal } from "./cli";

import { getUpdater } from "./auto-updater";
let teaProtocolPath = ""; // this should be empty string

export const setProtocolPath = (path: string) => {
	teaProtocolPath = path;
};

export default function initializeHandlers() {
	ipcMain.handle("get-installed-packages", async () => {
		try {
			const pkgs = await getInstalledPackages();
			return pkgs;
		} catch (error) {
			log.error(error);
			return [];
		}
	});

	ipcMain.handle("get-session", async () => {
		try {
			const session = await readSessionData();
			return session;
		} catch (error) {
			log.error(error);
			return {};
		}
	});

	ipcMain.handle("update-session", async (_, data) => {
		try {
			await writeSessionData(data as Session);
		} catch (error) {
			log.error(error);
		}
	});

	ipcMain.handle("install-package", async (_, data) => {
		try {
			const result = await installPackage(data.full_name);
			return result;
		} catch (error) {
			log.error(error);
			return error;
		}
	});

	ipcMain.handle("open-terminal", async (_, data) => {
		const { cmd } = data as { cmd: string };
		try {
			// TODO: detect if mac or linux
			// current openTerminal is only design for Mac
			await openTerminal(cmd);
		} catch (error) {
			console.error("elast:", error);
		}
	});

	ipcMain.handle("relaunch", async () => {
		try {
			const autoUpdater = getUpdater();
			await autoUpdater.quitAndInstall();
		} catch (error) {
			log.error(error);
		}
	});

	ipcMain.handle("get-protocol-path", async () => {
		const path = teaProtocolPath;
		teaProtocolPath = "";
		return path;
	});
}
