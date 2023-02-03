export async function installPackageCommand(full_name: string) {
	return new Promise((resolve, reject) => {
		// const teaInstallCommand = new Command('tea-install', [`+${full_name}`, 'true']);
		// teaInstallCommand.on('error', reject);

		// const handleLineOutput = async (line: string | { code: number }) => {
		// 	const c = await child;
		// 	if (
		// 		(typeof line === 'string' && line.includes('installed:')) ||
		// 		(typeof line !== 'string' && line?.code === 0)
		// 	) {
		// 		c.kill();
		// 		resolve(c.pid);
		// 	} else if (typeof line !== 'string' && line?.code === 1) {
		// 		reject();
		// 	}
		// };

		// teaInstallCommand.stdout.on('data', handleLineOutput);
		// teaInstallCommand.stderr.on('data', handleLineOutput);
		// teaInstallCommand.on('close', (line: string) => {
		// 	console.log('command closed!');
		// 	handleLineOutput(line || '');
		// });
		// teaInstallCommand.on('error', (line: string) => {
		// 	console.log('command error!', line);
		// 	handleLineOutput(line || '');
		// });
		// const child = teaInstallCommand.spawn();
		setTimeout(resolve, 10000);
	});
}
