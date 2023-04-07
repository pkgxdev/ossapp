export default function mouseLeaveDelay(element: HTMLElement, timeout = 600) {
	let isOut = false;

	const handleEnter = () => {
		isOut = false;
	};

	const onDestroy = () => {
		element.removeEventListener("mouseenter", handleEnter, true);
		element.removeEventListener("mouseleave", handleLeave, true);
	};

	const handleLeave = () => {
		isOut = true;
		setTimeout(() => {
			if (isOut && element) {
				element.dispatchEvent(new CustomEvent("leave_delay"));
				onDestroy();
			}
		}, timeout);
	};

	element.addEventListener("mouseenter", handleEnter, true);
	element.addEventListener("mouseleave", handleLeave, true);

	return {
		destroy: onDestroy
	};
}
