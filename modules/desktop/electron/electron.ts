import windowStateManager from 'electron-window-state';
import { app, BrowserWindow, ipcMain } from 'electron';
import contextMenu from 'electron-context-menu';
import serve from 'electron-serve';

import { getInstalledPackages } from './libs/teaDir';
import { readSessionData, writeSessionData } from './libs/auth';
import type { Session } from '../src/libs/types';
import { installPackage, openTerminal } from './libs/cli';

// try {
// 	//@ts-ignore only used in dev should not be packaged inprod
// 	/* eslint-disable */
// 	const er = require('electron-reloader');
// 	er(module);
// } catch (e) {
// 	console.error(e);
// }

const serveURL = serve({ directory: '.' });
const port = process.env.PORT || 3000;
const dev = !app.isPackaged;
let mainWindow: BrowserWindow | null;

function createWindow() {
	const windowState = windowStateManager({
		defaultWidth: 800,
		defaultHeight: 600
	});

	const mainWindow = new BrowserWindow({
		backgroundColor: 'whitesmoke',
		autoHideMenuBar: true,
		trafficLightPosition: {
			x: 17,
			y: 32
		},
		minHeight: 450,
		minWidth: 500,
		webPreferences: {
			// enableRemoteModule: true,
			contextIsolation: false,
			nodeIntegration: true,
			spellcheck: false,
			webSecurity: false,
			devTools: dev
			// preload: path.join(app.getAppPath(), 'preload.cjs')
		},
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height
	});

	windowState.manage(mainWindow);

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.on('close', () => {
		windowState.saveState(mainWindow);
	});

	return mainWindow;
}

contextMenu({
	showLookUpSelection: false,
	showSearchWithGoogle: false,
	showCopyImage: false,
	prepend: (defaultActions, params, browserWindow) => [
		{
			label: 'Make App 💻'
		}
	]
});

function loadVite(port) {
	mainWindow?.loadURL(`http://localhost:${port}`).catch((e) => {
		console.log('Error loading URL, retrying', e);
		setTimeout(() => {
			loadVite(port);
		}, 200);
	});
}

function createMainWindow() {
	mainWindow = createWindow();
	mainWindow.once('close', () => {
		mainWindow = null;
	});

	if (dev) loadVite(port);
	else serveURL(mainWindow);
}

app.once('ready', createMainWindow);
app.on('activate', () => {
	if (!mainWindow) {
		createMainWindow();
	}
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('to-main', (event, count) => {
	return mainWindow?.webContents.send('from-main', `next count is ${count + 1}`);
});

ipcMain.handle('get-installed-packages', async () => {
	const pkgs = await getInstalledPackages();
	return pkgs;
});

ipcMain.handle('get-session', async () => {
	const session = await readSessionData();
	return session;
});

ipcMain.handle('update-session', async (_, data) => {
	await writeSessionData(data as Session);
});

ipcMain.handle('install-package', async (_, data) => {
	const result = await installPackage(data.full_name);
	return result;
});

ipcMain.handle('open-terminal', async (_, data) => {
	const { cmd } = data as { cmd: string };
	try {
		// TODO: detect if mac or linux
		// current openTerminal is only design for Mac
		await openTerminal(cmd);
	} catch (error) {
		console.error('elast:', error);
	}
});
