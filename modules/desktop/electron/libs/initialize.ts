import fs from "fs";
import { getGuiPath } from "./tea-dir";
import * as log from "electron-log";
import semver from "semver";
import { cliBinPath, asyncExec } from "./cli";
import { createInitialSessionFile } from "./auth";

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

		const curlCommand = `curl -L -o "${cliBinPath}" "${binaryUrl}"`;

		if (fs.existsSync(cliBinPath)) {
			log.info("binary tea already exists at", cliBinPath);
			binCheck = await asyncExec(`cd ${destinationDirectory} && ./tea --version`);
		} else {
			try {
				await asyncExec(curlCommand);
				log.info("Binary downloaded and saved to", cliBinPath);
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
