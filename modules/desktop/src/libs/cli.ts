const { ipcRenderer } = window.require('electron');

export async function installPackageCommand(full_name: string) {
	const res = await ipcRenderer.invoke('install-package', { full_name });
	console.log('install:', res);
}
