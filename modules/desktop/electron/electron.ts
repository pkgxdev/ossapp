import windowStateManager from "electron-window-state";
import { app, BrowserWindow, ipcMain, net, dialog } from "electron";
import { setupTitlebar, attachTitlebarToWindow } from "custom-electron-titlebar/main";
import * as Sentry from "@sentry/electron";
import contextMenu from "electron-context-menu";
import serve from "electron-serve";

import { getInstalledPackages } from "./libs/tea-dir";
import { readSessionData, writeSessionData } from "./libs/auth";
import type { Session } from "../src/libs/types";
import { installPackage, openTerminal } from "./libs/cli";
import { post } from "./libs/v1-client";
import * as log from "electron-log";
import path from "path";
import { nameToSlug } from "./libs/package";

import Pushy from "pushy-electron";

import { checkUpdater, getUpdater } from "./libs/auto-updater";

/*
 TODO:
 - fix global mutable variable
 - organize the ipc handlers into its own module
 - create auto updater initialization module
 */
let teaProtocolPath = ""; // this should be empty string

log.info("App starting...");
if (app.isPackaged) {
	Sentry.init({
		dsn: "https://5ff29bb5b3b64cd4bd4f4960ef1db2e3@o4504750197899264.ingest.sentry.io/4504750206746624",
		debug: true,
		transportOptions: {
			maxQueueAgeDays: 30,
			maxQueueCount: 30,
			beforeSend: async () => {
				const ol = await net.isOnline();
				log.log("isOnline", ol);
				return ol ? "send" : "queue";
			}
		}
	});
}
const serveURL = serve({ directory: "." });
const port = process.env.PORT || 3000;
const allowDebug = !app.isPackaged || process.env.DEBUG_BUILD === "1";
let mainWindow: BrowserWindow | null;

// todo: this is awful, there should be a way to check where all windows are closed in mac
let macWindowClosed = false;

setupTitlebar();

function createWindow() {
	const windowState = windowStateManager({
		defaultWidth: 1000,
		defaultHeight: 600
	});

	const mainWindow = new BrowserWindow({
		titleBarStyle: "hidden",
		backgroundColor: "black",
		autoHideMenuBar: true,
		trafficLightPosition: {
			x: 14,
			y: 13
		},
		minHeight: 600,
		minWidth: 1000,
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
			spellcheck: false,
			webSecurity: false,
			devTools: allowDebug,
			preload: path.join(app.getAppPath(), "preload.cjs")
		},
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height
	});

	windowState.manage(mainWindow);
	mainWindow.webContents.openDevTools();
	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.on("close", () => {
		windowState.saveState(mainWindow);
	});

	mainWindow.webContents.on("did-finish-load", () => {
		Pushy.listen();
		// Register device for push notifications
		Pushy.register({ appId: "64110fb47446e48a2a0e906d" })
			.then(async (token) => {
				const { device_id } = await readSessionData();
				console.log("DEVICE_ID:", device_id, token);
				if (device_id)
					await post(`/auth/device/${device_id}/register-push-token`, { push_token: token });
			})
			.catch((err) => {
				// Display error dialog
				// Pushy.alert(mainWindow, 'Pushy registration error: ' + err.message);
			});

		// Listen for incoming notifications
		Pushy.setNotificationListener((data: any) => {
			// Display an alert with the "message" payload value
			log.info("push data:", data);
			// TODO: replace this with something
			Pushy.alert(mainWindow, data?.message as string);
		});
	});

	attachTitlebarToWindow(mainWindow);
	return mainWindow;
}

contextMenu({
	showLookUpSelection: false,
	showSearchWithGoogle: false,
	showCopyImage: false,
	prepend: (defaultActions, params, browserWindow) => [
		{
			label: "Make App 💻"
		}
	]
});

function loadVite(port) {
	mainWindow?.loadURL(`http://localhost:${port}?is-vite=true`).catch((e) => {
		console.log("Error loading URL, retrying", e);
		setTimeout(() => {
			loadVite(port);
		}, 200);
	});
}

function createMainWindow() {
	if (mainWindow) {
		if (mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.focus();
	} else {
		mainWindow = createWindow();
	}

	checkUpdater(mainWindow);

	mainWindow.once("close", () => {
		mainWindow = null;
	});

	if (!app.isPackaged) {
		// dev
		loadVite(port);
	} else {
		serveURL(mainWindow);
	}
}

if (process.defaultApp) {
	app.setAsDefaultProtocolClient("tea", process.execPath, [path.resolve(process.argv[1])]);
} else {
	app.setAsDefaultProtocolClient("tea");
}

app.once("ready", createMainWindow);

app.on("activate", () => {
	if (!mainWindow) {
		createMainWindow();
	}
});
app.on("window-all-closed", async () => {
	// mac ux is just minimize them when closed unless forced quite CMD+Q
	macWindowClosed = true;
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// NOTE: this doesnt work in linux
// 	you have to loop through process.argv to figure out which url launched the app
app.on("open-url", (event, url) => {
	// ie url:  tea://packages/slug
	event.preventDefault();

	const packagesPrefix = "/packages/";

	let rawPath = url.replace("tea:/", "");

	const isPackage = url.includes(packagesPrefix);
	if (isPackage) {
		// /packages/github.com/pypa/twine -> /packages/github_com_pypa_twine
		const packageSlug = nameToSlug(rawPath.replace(packagesPrefix, ""));
		rawPath = [packagesPrefix, packageSlug].join("");
	}

	teaProtocolPath = rawPath;

	if (mainWindow && mainWindow.isMinimized()) {
		mainWindow.restore();
		log.info("restored");
		mainWindow?.webContents.send("sync-path");
	} else if (macWindowClosed) {
		log.info("open new window");
		createMainWindow();
	}
});

ipcMain.handle("get-installed-packages", async () => {
	const pkgs = await getInstalledPackages();
	return pkgs;
});

ipcMain.handle("get-session", async () => {
	const session = await readSessionData();
	return session;
});

ipcMain.handle("update-session", async (_, data) => {
	await writeSessionData(data as Session);
});

ipcMain.handle("install-package", async (_, data) => {
	const result = await installPackage(data.full_name);
	return result;
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
	const autoUpdater = getUpdater();
	await autoUpdater.quitAndInstall();
});

ipcMain.handle("get-protocol-path", async () => {
	const path = teaProtocolPath;
	teaProtocolPath = "";
	return path;
});
