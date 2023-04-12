import { spawn, execSync, exec } from "child_process";
import { clean } from "semver";
import { getGuiPath } from "./tea-dir";
import fs from "fs";
import path from "path";
import initializeTeaCli from "./initialize";

import * as log from "electron-log";
import { subscribeToPackageTopic } from "./push-notification";

const destinationDirectory = getGuiPath();

export const cliBinPath = path.join(destinationDirectory, "tea");

export async function installPackage(full_name: string) {
	const teaVersion = await initializeTeaCli();

	if (!teaVersion) throw new Error("no tea");
	log.info(`installing package ${full_name}`);
	await execSync(`cd ${destinationDirectory} && ./tea +${full_name} true`);
}

export async function openTerminal(cmd: string) {
	let scriptPath = "";
	try {
		// TODO SECURITY: escape the cmd if possible or create whitelist of acceptable commands
		scriptPath = await createCommandScriptFile(cmd);
		if (!scriptPath) throw new Error("unable to create Applse Script");
		let stdout = ``;
		let stderr = ``;

		await new Promise((resolve, reject) => {
			const child = spawn("/usr/bin/osascript", [scriptPath]);
			child.stdout.on("data", (data) => {
				stdout += data.toString().trim();
			});
			child.stderr.on("data", (data) => {
				stderr += data.toString().trim();
			});

			child.on("exit", () => {
				console.log("exit:", stdout);
				resolve(stdout);
			});

			child.on("error", () => {
				reject(new Error(stderr));
			});
		});
	} catch (error) {
		log.error("openTerminal:", error);
	} finally {
		if (scriptPath) await fs.unlinkSync(scriptPath);
	}
}

export async function installTeaCli(version: string): Promise<string> {
	try {
		log.info("installing tea-cli");
		const command = 'TEA_YES=1 bash -c "sh <(curl https://tea.xyz)"';
		const output = execSync(command, { encoding: "utf-8" });
		log.info("tea-cli installed");
		return "success";
	} catch (error) {
		log.error(error);
		return error.message;
	}
}

const createCommandScriptFile = async (cmd: string): Promise<string> => {
	try {
		const guiFolder = getGuiPath();
		const tmpFilePath = path.join(guiFolder, `${+new Date()}.scpt`);
		const command = `"${cmd.replace(/"/g, '\\"')}"`;
		const script = `
			tell application "iTerm"
				activate
				if application "iTerm" is running then
						try
								tell the first window to create tab with default profile
						on error
								create window with default profile
						end try
				end if
	
				delay 0.1
	
				tell the first window to tell current session to write text ${command}
			end tell
		`.trim();

		await fs.writeFileSync(tmpFilePath, script, "utf-8");
		return tmpFilePath;
	} catch (error) {
		log.error(error);
		return "";
	}
};
