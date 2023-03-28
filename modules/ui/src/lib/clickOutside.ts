/**
 * Use this script on an element with use:clickOutside to register for click events that occur
 * outside of the element
 */
export default function clickOutside(element: HTMLElement) {
	const handleClick = (event: any) => {
		if (element && !element.contains(event.target) && !event.defaultPrevented) {
			element.dispatchEvent(new CustomEvent("click_outside"));
		}
	};

	document.addEventListener("click", handleClick, true);

	return {
		destroy() {
			document.removeEventListener("click", handleClick, true);
		}
	};
}
