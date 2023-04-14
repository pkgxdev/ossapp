export default function mouseLeaveDelay(element: HTMLElement, timeout = 600) {
	let isOut = false;
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	const handleEnter = () => {
		isOut = false;
	};

	const onDestroy = () => {
		element.removeEventListener("mouseenter", handleEnter);
		element.removeEventListener("mouseleave", handleLeave);
	};

	const handleLeave = () => {
		isOut = true;

		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			if (isOut && element) {
				element.dispatchEvent(new CustomEvent("leave_delay"));
				onDestroy();
			}
		}, timeout);
	};

	element.addEventListener("mouseenter", handleEnter);
	element.addEventListener("mouseleave", handleLeave);

	return {
		destroy: onDestroy
	};
}
