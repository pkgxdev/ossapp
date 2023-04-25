import { spawn, exec } from "child_process";
import { getGuiPath } from "./tea-dir";
import fs from "fs";
import path from "path";
import initializeTeaCli from "./initialize";

import { app } from "electron";
import log from "./logger";
import { MainWindowNotifier } from "./types";

const destinationDirectory = getGuiPath();

export const cliBinPath = path.join(destinationDirectory, "tea");

export async function installPackage(
	full_name: string,
	version: string,
	notifyMainWindow: MainWindowNotifier
) {
	const teaVersion = await initializeTeaCli();
	const progressNotifier = newInstallProgressNotifier(full_name, notifyMainWindow);

	if (!teaVersion) throw new Error("no tea");

	const qualifedPackage = `${full_name}@${version}`;

	log.info(`installing package ${qualifedPackage}`);

	let stdout = "";
	let stderr = "";

	await new Promise((resolve, reject) => {
		// tea requires HOME to be set.
		const opts = { env: { HOME: app.getPath("home"), NO_COLOR: "1" } };

		const child = spawn(
			`${destinationDirectory}/tea`,
			["--env=false", "--sync", "--json", `+${qualifedPackage}`],
			opts
		);

		child.stdout.on("data", (data) => {
			stdout += data.toString().trim();
		});

		child.stderr.on("data", (data) => {
			try {
				const msg = JSON.parse(data.toString().trim());
				progressNotifier(msg);
			} catch (err) {
				//swallow it
			}

			stderr += data.toString().trim();
		});

		child.on("exit", (code) => {
			console.log("stdout:", stdout);
			if (code !== 0) {
				reject(new Error("tea exited with non-zero code: " + code));
			} else {
				resolve(null);
			}
		});

		child.on("error", () => {
			reject(new Error(stderr));
		});
	});
}

// This is hacky and kind of complex because of the output we get from the CLI.  When the CLI
// gives better output this definitely should get looked at.
function newInstallProgressNotifier(full_name: string, notifyMainWindow: MainWindowNotifier) {
	// the install progress is super spammy, only send every 10th update
	let counter = 0;

	// the totall number of packages to install - this is set by the "resolved" message
	let numberOfPackages = 1;

	// the current package number - this is incremented by the "installed" or "downloaded" message
	let currentPackageNumber = 0;

	return function (msg: any) {
		if (msg.status !== "downloading") {
			log.info("cli:", msg);
		}

		if (msg.status === "resolved") {
			numberOfPackages = msg.pkgs?.length ?? 1;
			log.info(`installing ${numberOfPackages} packages`);
		} else if (msg.status === "downloading") {
			counter++;
			if (counter % 10 !== 0) return;

			const { received = 0, "content-size": contentSize = 0 } = msg;
			if (contentSize > 0) {
				// how many total pacakges are completed
				const overallProgress = (currentPackageNumber / numberOfPackages) * 100;
				// how much of the current package is completed
				const packageProgress = (received / contentSize) * 100;
				// progress is the total packages completed plus the percentage of the current package
				const progress = (overallProgress + packageProgress / numberOfPackages).toFixed(2);
				notifyMainWindow("install-progress", { full_name, progress });
			}
		} else if (msg.status === "installed") {
			currentPackageNumber++;
			const progress = ((currentPackageNumber / numberOfPackages) * 100).toFixed(2);
			notifyMainWindow("install-progress", { full_name, progress });
		}
	};
}

export async function openPackageEntrypointInTerminal(pkg: string) {
	let sh = `${cliBinPath} --sync --env=false +${pkg} `;
	if (pkg == "github.com/AUTOMATIC1111/stable-diffusion-webui") {
		sh += `~/.tea/${pkg}/v*/entrypoint.sh`;
	} else {
		sh += "sh";
	}

	const scriptPath = await createCommandScriptFile(sh);

	try {
		let stdout = "";
		let stderr = "";

		await new Promise((resolve, reject) => {
			const child = spawn("/usr/bin/osascript", [scriptPath]);
			child.stdout.on("data", (data) => {
				stdout += data.toString().trim();
			});
			child.stderr.on("data", (data) => {
				stderr += data.toString().trim();
			});

			child.on("exit", (code) => {
				console.info("exit:", code, `\`${stdout}\``);
				if (code == 0) {
					resolve(stdout);
				} else {
					reject(new Error("failed to open terminal and run tea sh"));
				}
			});

			child.on("error", () => {
				reject(new Error(stderr));
			});
		});
	} finally {
		if (scriptPath) await fs.unlinkSync(scriptPath);
	}
}

const createCommandScriptFile = async (cmd: string): Promise<string> => {
	const guiFolder = getGuiPath();
	const tmpFilePath = path.join(guiFolder, `${+new Date()}.scpt`);
	const command = `${cmd.replace(/"/g, '\\"')}`;
	const script = `
    tell application "Terminal"
      activate
      do script "${command}"
    end tell
  `.trim();

	await fs.writeFileSync(tmpFilePath, script, "utf-8");
	return tmpFilePath;
};

export async function asyncExec(cmd: string): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(cmd, (err, stdout) => {
			if (err) {
				console.log("err:", err);
				reject(err);
				return;
			}
			console.log("stdout:", stdout);
			resolve(stdout);
		});
	});
}

export async function syncPantry() {
	const teaVersion = await initializeTeaCli();

	if (!teaVersion) throw new Error("no tea");
	log.info("Syncing pantry");
	await asyncExec(`cd '${destinationDirectory}' && ./tea -S`);
}
