import { writable } from 'svelte/store';

import { getDeviceAuth } from '@api';
import type { Developer } from '@tea/ui/types';
import type { Session } from '$libs/types';

const { ipcRenderer } = window.require('electron');

const basePath = '.tea/tea.xyz/gui';

export let session: Session | null = null;
export const getSession = async (): Promise<Session | null> => {
	session = await ipcRenderer.invoke('get-session');
	return session;
};

export default function initAuthStore() {
	const sessionStore = writable<Session>({});
	let pollLoop = 0;

	const deviceIdStore = writable<string>('');
	let deviceId = '';

	getSession().then((sess) => {
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
		console.log('localSession:', localSession);
		await ipcRenderer.invoke('update-session', localSession);
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
