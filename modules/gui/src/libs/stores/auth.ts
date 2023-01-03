import { writable } from 'svelte/store';
import { BaseDirectory, createDir, readTextFile, writeTextFile } from '@tauri-apps/api/fs';
import { join } from '@tauri-apps/api/path';
import { getDeviceAuth } from '@api';
import type { User } from '@tea/ui/types';

const basePath = '.tea/tea.xyz/gui';
interface Session {
	key: string;
	user: any;
}

export default function initAuthStore() {
	const deviceId = 'abcdevf'; // ideally randomly generated on install
	const session = writable<Session>();
	let pollLoop = 0;
	initSession();

	let timer: NodeJS.Timer | null;
	// TODO:
	// fetch session data from local
	// fetch session data remotely
	// update local session data

	async function pollSession() {
		if (!timer) {
			timer = setInterval(async () => {
				pollLoop++;
				try {
					const data = await getDeviceAuth();
					if (data.status === 'SUCCESS') {
						session.set({
							key: data.key,
							user: data.user
						});
						timer && clearInterval(timer);
						timer = null;
					}
					console.log(data);
				} catch (error) {
					console.error(error);
				}

				if (pollLoop > 20 && timer) {
					clearInterval(timer);
					pollLoop = 0;
					timer = null;
				}
			}, 2000);
		}
	}

	return {
		deviceId,
		subscribe: (cb: (u: User) => void) => {
			return session.subscribe((v) => v && cb(v.user));
		},
		pollSession
	};
}

const initSession = async (): Promise<Session | void> => {
	await createGuiDataFolder();
	const session = await getSessionData();
	console.log(session);
};

const createGuiDataFolder = async () => {
	await createDir(basePath, {
		dir: BaseDirectory.Home,
		recursive: true
	});
};

const getSessionData = async (): Promise<Session | void> => {
	const sessionFilePath = await join(basePath, 'tmp.dat');
	try {
		const data = await readTextFile(sessionFilePath, {
			dir: BaseDirectory.Home
		});
		// TODO: decrypt then return
		console.log('data:', data);
	} catch (error) {
		console.error(error);
		await writeTextFile(sessionFilePath, '', {
			dir: BaseDirectory.Home
		});
	}
	console.log(sessionFilePath);
};

const saveSessionData = async (data: { [key: string]: string | number | Date }) => {
	const sessionFilePath = await join(basePath, 'tmp.dat');
	// TODO: encrypt and write
};
