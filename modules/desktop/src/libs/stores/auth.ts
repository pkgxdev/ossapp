import { writable } from 'svelte/store';
// import { app } from 'electron';
// import { join } from 'upath';
// import fs from 'fs';
import { getDeviceAuth, registerDevice } from '@api';
import type { Developer } from '@tea/ui/types';

const basePath = '.tea/tea.xyz/gui';
export interface Session {
	device_id?: string;
	key?: string;
	user?: Developer;
}

export let session: Session | null = null;
export const getSession = async (): Promise<Session | null> => {
	// await app.whenReady();
	// if (session && session?.user) return session;
	// const homePath = app.getPath('home');
	// const sessionFilePath = await join(homePath, basePath, 'tmp.dat');
	// try {
	// 	const encryptedData = fs.readFileSync(sessionFilePath, 'utf-8');
	// 	session = JSON.parse(encryptedData || '{}') as Session;
	// 	return session;
	// } catch (error) {
	// 	return null;
	// }
	return null;
};

export default function initAuthStore() {
	const sessionStore = writable<Session>({});
	let pollLoop = 0;

	const deviceIdStore = writable<string>('');
	let deviceId = '';

	initSession().then((sess) => {
		if (sess) {
			session = sess;
			sessionStore.set(sess);
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
		sessionStore.set(localSession);
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
			return sessionStore.subscribe((v) => v?.user && cb(v.user));
		},
		pollSession
	};
}

const initSession = async (): Promise<Session | void> => {
	// const homePath = app.getPath('home');
	// try {
	// 	await fs.mkdirSync(join(homePath, basePath));
	// } catch (error) {
	// 	console.error(error);
	// }
	// const session = await getLocalSessionData();
	// return session;
};

const getLocalSessionData = async (): Promise<Session | void> => {
	let data: Session;
	try {
		const session = await getSession();
		if (!session) throw new Error('no session');
		data = session;
	} catch (error) {
		console.error('register device:', error);
		const deviceId = await registerDevice();
		data = {
			device_id: deviceId
		};
		await saveLocallySessionData(data);
	}

	return data;
};

const saveLocallySessionData = async (data: Session) => {
	// const homePath = app.getPath('home');
	// const sessionFilePath = await join(homePath, basePath, 'tmp.dat');
	// // TODO: encrypt first
	// await fs.writeFileSync(sessionFilePath, JSON.stringify(data), 'utf-8');
};
