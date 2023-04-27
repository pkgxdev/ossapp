import fs from "fs";
import { getGuiPath } from "./tea-dir";
import log from "./logger";
import semver from "semver";
import { cliBinPath, asyncExec } from "./cli";
import { createInitialSessionFile } from "./auth";
import semverCompare from "semver/functions/compare";

// Versions before this do not support the --json flag
const MINIMUM_TEA_VERSION = "0.28.3";

const destinationDirectory = getGuiPath();

// TODO: move device_id generation here

// Get the binary path from the current app directory
const binaryUrl = "https://tea.xyz/$(uname)/$(uname -m)";

let initializePromise: Promise<string> | null = null;

export async function initializeTeaCli(): Promise<string> {
	if (initializePromise) {
		return initializePromise;
	}

	log.info("Initializing tea cli");
	initializePromise = initializeTeaCliInternal();

	initializePromise.catch((error) => {
		log.info("Error initializing tea cli, resetting promise:", error);
		initializePromise = null;
	});

	return initializePromise;
}

async function initializeTeaCliInternal(): Promise<string> {
	try {
		let binCheck = "";
		let needsUpdate = false;

		// Create the destination directory if it doesn't exist
		if (!fs.existsSync(destinationDirectory)) {
			fs.mkdirSync(destinationDirectory, { recursive: true });
		}

		const curlCommand = `curl -L -o "${cliBinPath}" "${binaryUrl}"`;

		const exists = fs.existsSync(cliBinPath);
		if (exists) {
			log.info("binary tea already exists at", cliBinPath);
			try {
				binCheck = await asyncExec(`cd ${destinationDirectory} && ./tea --version`);
				const teaVersion = binCheck.toString().split(" ")[1];
				if (semverCompare(teaVersion, MINIMUM_TEA_VERSION) < 0) {
					log.info("binary tea version is too old, updating");
					needsUpdate = true;
				}
			} catch (error) {
				// probably binary is not executable or no permission
				log.error("Error checking tea binary version:", error);
				needsUpdate = true;
				await asyncExec(`cd ${destinationDirectory} && rm tea`);
			}
		}

		if (!exists || needsUpdate) {
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

		const version = binCheck.toString().split(" ")[1];
		log.info("binary tea version:", version);
		return semver.valid(version.trim()) ? version : "";
	} catch (error) {
		log.error(error);
		return "";
	}
}

export default async function initialize(): Promise<string> {
	const [version] = await Promise.all([initializeTeaCli(), createInitialSessionFile()]);
	return version;
}
