const { ipcRenderer } = window.require("electron");

export async function installPackageCommand(full_name: string) {
	const res = await ipcRenderer.invoke("install-package", { full_name });
	if (res instanceof Error) {
		throw res;
	}
}
