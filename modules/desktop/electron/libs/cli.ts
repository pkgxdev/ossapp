import { spawn } from 'child_process';
import { clean } from 'semver';
import { getGuiPath } from './teaDir';
import fs from 'fs';
import path from 'path';

export async function installPackage(full_name: string) {
	return await new Promise((resolve, reject) => {
		let version = '';
		let lastError = '';
		const teaInstallation = spawn('tea', [`+${full_name}`, 'true']);

		teaInstallation.stdout.on('data', (data) => {
			console.log('stdout:', data);
		});

		teaInstallation.stderr.on('data', (err) => {
			lastError = err.toString();
			if (lastError && lastError.includes('installed') && lastError.includes(full_name)) {
				version = lastError.split('/').pop() || '';
			}
		});

		teaInstallation.on('exit', (code) => {
			if (code === 0) {
				resolve({ version: clean(version) });
			} else {
				reject(new Error(lastError));
			}
		});
	});
}

export async function openTerminal(cmd: string) {
	let scriptPath = '';
	try {
		// TODO SECURITY: escape the cmd if possible or create whitelist of acceptable commands
		scriptPath = await createCommandScriptFile(cmd);
		let stdout = ``;
		let stderr = ``;

		await new Promise((resolve, reject) => {
			const child = spawn('/usr/bin/osascript', [scriptPath]);
			child.stdout.on('data', (data) => {
				stdout += data.toString().trim();
			});
			child.stderr.on('data', (data) => {
				stderr += data.toString().trim();
			});

			child.on('exit', () => {
				console.log('exit:', stdout);
				resolve(stdout);
			});

			child.on('error', () => {
				reject(new Error(stderr));
			});
		});
	} catch (error) {
		console.error('root:', error);
	} finally {
		if (scriptPath) await fs.unlinkSync(scriptPath);
	}
}

const createCommandScriptFile = async (cmd: string): Promise<string> => {
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

	await fs.writeFileSync(tmpFilePath, script, 'utf-8');
	return tmpFilePath;
};
