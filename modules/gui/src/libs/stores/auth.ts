import { writable } from 'svelte/store';
import { BaseDirectory, createDir, readTextFile, writeTextFile } from '@tauri-apps/api/fs';
import { join } from '@tauri-apps/api/path';
import { getDeviceAuth, registerDevice } from '@api';
import type { Developer } from '@tea/ui/types';

const basePath = '.tea/tea.xyz/gui';
interface Session {
	device_id?: string;
	key?: string;
	user?: Developer;
}

export default function initAuthStore() {
	const session = writable<Session>({});
	let pollLoop = 0;

	const deviceIdStore = writable<string>('');
	let deviceId = '';

	initSession().then((sess) => {
		if (sess) {
			session.set(sess);
			deviceIdStore.set(sess.device_id!);
			deviceId = sess.device_id!;
		}
	});

	let timer: NodeJS.Timer | null;

	async function updateSession(data: Session) {
		const localSession = {
			device_id: deviceId,
			key: data.key,
			user: data.user
		};
		saveLocallySessionData(localSession);
		session.set(localSession);
	}

	async function pollSession() {
		if (!timer) {
			timer = setInterval(async () => {
				pollLoop++;
				try {
					const data = await getDeviceAuth(deviceId);
					console.log('dd', deviceId, data);
					if (data.status === 'SUCCESS') {
						updateSession({
							key: data.key,
							user: data.user
						});
						timer && clearInterval(timer);
						timer = null;
					}
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
		deviceIdStore,
		subscribe: (cb: (u: Developer) => void) => {
			return session.subscribe((v) => v?.user && cb(v.user));
		},
		pollSession
	};
}

const initSession = async (): Promise<Session | void> => {
	await createDir(basePath, {
		dir: BaseDirectory.Home,
		recursive: true
	});
	const session = await getLocalSessionData();
	return session;
};

const getLocalSessionData = async (): Promise<Session | void> => {
	const sessionFilePath = await join(basePath, 'tmp.dat');
	let data: Session;
	try {
		const encryptedData = await readTextFile(sessionFilePath, {
			dir: BaseDirectory.Home
		});
		// TODO: decrypt then return
		data = JSON.parse(encryptedData || '{}');
	} catch (error) {
		console.error(error);
		const deviceId = await registerDevice();
		data = {
			device_id: deviceId
		};
		await saveLocallySessionData(data);
	}

	return data;
};

const saveLocallySessionData = async (data: Session) => {
	const sessionFilePath = await join(basePath, 'tmp.dat');
	// TODO: encrypt first
	await writeTextFile(sessionFilePath, JSON.stringify(data), {
		dir: BaseDirectory.Home
	});
};
