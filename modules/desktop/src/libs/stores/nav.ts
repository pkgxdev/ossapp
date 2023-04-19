import { writable } from "svelte/store";
import { goto } from "$app/navigation";

const log = window.require("electron-log");

export default function initNavStore() {
	const sideNavOpen = writable<boolean>(false);
	const historyStore = writable<string[]>(["/"]);
	const showWelcome = writable<boolean>(false);

	let history = ["/"];

	historyStore.subscribe((v) => (history = v));

	const prevPathStore = writable<string>("");
	const nextPathStore = writable<string>("");

	let currentIndex = 0; // if non next/back click

	let isMovingNext = false;
	let isMovingBack = false;

	return {
		showWelcome,
		historyStore,
		sideNavOpen,
		prevPath: prevPathStore,
		nextPath: nextPathStore,
		next: () => {
			if (currentIndex < history.length - 1) {
				isMovingNext = true;
				goto(history[currentIndex + 1]);
				prevPathStore.set(history[currentIndex]);
				currentIndex++;
				if (currentIndex >= history.length - 1) nextPathStore.set("");
			}
		},
		back: () => {
			if (currentIndex > 0) {
				isMovingBack = true;
				goto(history[currentIndex - 1]);
				nextPathStore.set(history[currentIndex]);
				currentIndex--;
				if (currentIndex === 0) prevPathStore.set("");
			}
		},
		setNewPath: (newNextPath: string, newPrevPath: string) => {
			const oldCurrentPath = history[currentIndex];
			const isNavArrows = isMovingBack || isMovingNext;
			if (!isNavArrows && newNextPath !== oldCurrentPath) {
				historyStore.update((history) => {
					const cleanHistory = history.filter((_v, i) => i <= currentIndex);
					currentIndex = cleanHistory.length;
					prevPathStore.set(cleanHistory[currentIndex - 1]);
					return [...cleanHistory, newNextPath];
				});
			}
			isMovingNext = false;
			isMovingBack = false;
		}
	};
}
