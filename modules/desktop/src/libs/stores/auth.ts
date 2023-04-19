import { writable } from "svelte/store";

import { getDeviceAuth } from "@native";
import type { Developer } from "@tea/ui/types";
import type { Session } from "$libs/types";
import { getSession as electronGetSession, updateSession as electronUpdateSession } from "@native";

export let session: Session | null = null;
export const getSession = async (): Promise<Session | null> => {
	session = await electronGetSession();
	return session;
};

export default function initAuthStore() {
	const user = writable<Developer | undefined>();
	const sessionStore = writable<Session>({});
	let pollLoop = 0;

	const deviceIdStore = writable<string>("");
	let deviceId = "";

	getSession().then((sess) => {
		if (sess) {
			session = sess;
			sessionStore.set(sess);
			deviceIdStore.set(sess.device_id!);
			deviceId = sess.device_id!;
			if (sess.user) user.set(sess.user);
		}
	});

	let timer: NodeJS.Timer | null;

	async function updateSession(data: Session) {
		const localSession = {
			device_id: deviceId,
			key: data.key,
			user: data.user
		};

		await electronUpdateSession(localSession);
		sessionStore.set(localSession);
	}

	async function pollSession() {
		if (!timer) {
			timer = setInterval(async () => {
				pollLoop++;
				try {
					const data = await getDeviceAuth(deviceId);
					if (data.status === "SUCCESS") {
						updateSession({
							key: data.key,
							user: data.user
						});
						user.set(data.user!);
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

	function clearSession() {
		updateSession({ key: undefined, user: undefined });
		user.set(undefined);
	}

	return {
		user,
		session: sessionStore,
		deviceId,
		deviceIdStore,
		pollSession,
		clearSession
	};
}
