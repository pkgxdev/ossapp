import fs from "fs";
import { getGuiPath } from "./tea-dir";
import { execSync } from "child_process";
import * as log from "electron-log";
import semver from "semver";
import { cliBinPath } from "./cli";

const destinationDirectory = getGuiPath();

// TODO: move device_id generation here

// Get the binary path from the current app directory
const binaryUrl = "https://tea.xyz/$(uname)/$(uname -m)";

export default async function initializeTeaCli(): Promise<string> {
	let version = "";
	// Create the destination directory if it doesn't exist
	if (!fs.existsSync(destinationDirectory)) {
		fs.mkdirSync(destinationDirectory, { recursive: true });
	}

	const curlCommand = `curl -L -o "${cliBinPath}" "${binaryUrl}"`;

	if (fs.existsSync(cliBinPath)) {
		log.info("binary tea already exists at", cliBinPath);
		version = execSync(`cd ${destinationDirectory} && ./tea --version`).toString().split(" ")[1];
		log.info("binary tea version:", version);
	} else {
		try {
			execSync(curlCommand);
			log.info("Binary downloaded and saved to", cliBinPath);
			execSync("chmod u+x " + cliBinPath);
			log.info("Binary is now read for use at", cliBinPath);
			version = execSync(`cd ${destinationDirectory} && ./tea --version`).toString().split(" ")[1];
			log.info("binary tea version:", version);
		} catch (error) {
			log.error("Error setting-up tea binary:", error);
		}
	}

	return semver.valid(version.trim()) ? version : "";
}
