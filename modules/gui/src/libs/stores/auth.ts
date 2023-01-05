import { writable } from 'svelte/store';
import { BaseDirectory, createDir, readTextFile, writeTextFile } from '@tauri-apps/api/fs';
import { join } from '@tauri-apps/api/path';
import { getDeviceAuth, registerDevice } from '@api';
import type { User } from '@tea/ui/types';

const basePath = '.tea/tea.xyz/gui';
interface Session {
	device_id?: string;
	key?: string;
	user?: any;
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
		subscribe: (cb: (u: User) => void) => {
			return session.subscribe((v) => v && cb(v.user));
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
		const deviceId = await getDeviceId();
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

const getDeviceId = async (): Promise<string> => {
	const hasLocal = false;
	// get from local data
	// else get from server
	// 	GET /v1/auth/registerDevice
	let deviceId = '';
	if (hasLocal) {
	} else {
		deviceId = await registerDevice();
	}
	console.log('deviceId:', deviceId);
	return deviceId;
};
