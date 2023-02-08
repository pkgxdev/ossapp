import { spawn } from 'child_process';
import { clean } from 'semver';

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
