import fs from "fs";
import { app } from "electron";
import { getGuiPath } from "./tea-dir";
import * as log from "electron-log";
import semver from "semver";
import { cliBinPath, asyncExec } from "./cli";
import { createInitialSessionFile } from "./auth";
import path from "path";

const destinationDirectory = getGuiPath();

// TODO: move device_id generation here

// Get the binary path from the current app directory
const binaryUrl = "https://tea.xyz/$(uname)/$(uname -m)";

export async function initializeTeaCli(): Promise<string> {
	try {
		let version = "";
		let binCheck = "";
		// Create the destination directory if it doesn't exist
		if (!fs.existsSync(destinationDirectory)) {
			fs.mkdirSync(destinationDirectory, { recursive: true });
		}

		if (fs.existsSync(cliBinPath)) {
			log.info("binary tea already exists at", cliBinPath);
			binCheck = await asyncExec(`cd ${destinationDirectory} && ./tea --version`);
		} else {
			// /Applications/tea.app/Contents/Resources/app.asar
			const appPath = app.getAppPath();
			if (appPath.endsWith(".asar")) {
				const arch = (process.arch as string) === "arm64" ? "arm64" : "x86-64";
				const unpackedDir = appPath.replace(".asar", ".asar.unpacked");
				const binFile = `tea-${arch}`;
				const cpBin = path.join(unpackedDir, "external", binFile);
				await asyncExec(`cp ${cpBin} ${cliBinPath}`);
				log.info("Binary copied and saved to", cliBinPath);
			} else {
				// downlaod binary remotely
				const curlCommand = `curl -L -o "${cliBinPath}" "${binaryUrl}"`;
				await asyncExec(curlCommand);
				log.info("Binary downloaded and saved to", cliBinPath);
			}

			try {
				await asyncExec("chmod u+x " + cliBinPath);
				log.info("Binary is now ready for use at", cliBinPath);
				binCheck = await asyncExec(`cd ${destinationDirectory} && ./tea --version`);
			} catch (error) {
				log.error("Error setting-up tea binary:", error);
			}
		}
		version = binCheck.toString().split(" ")[1];
		log.info("binary tea version:", version);
		return semver.valid(version.trim()) ? version : "";
	} catch (error) {
		log.error(error);
		return "";
	}
}

export default async function initialize() {
	await Promise.all([initializeTeaCli(), createInitialSessionFile()]);
}
