import { spawn, exec } from 'child_process';
import { clean } from 'semver';
import { promisify } from 'util';

const child_process = require('child_process');

const execPromise = promisify(exec);

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
	try {
		// TODO SECURITY: escape the cmd if possible or create whitelist of acceptable commands
		return await exec(open(cmd));
	} catch (error) {
		console.error('root:', error);
	}
}

const open = (cmd) => `osascript -e '
  if application "iTerm" is running then
    tell application "iTerm"
			tell current window
					create tab with default profile
					tell current session
							write text "${cmd.replace(/"/g, '\\"')}"
					end tell
			end tell
    end tell
  else
    activate application "iTerm"
		delay 3
    tell application "iTerm"
			tell current window
					tell current session
							write text "${cmd.replace(/"/g, '\\"')}"
					end tell
			end tell
    end tell
  end if
'`;
