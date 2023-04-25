import log from "$libs/logger";

type DebounceableFunc = (...args: any[]) => void;

export type DebounceOptions = {
	lingerMs?: number;
};

export default function withDebounce(
	f: DebounceableFunc,
	{ lingerMs = 1000 }: DebounceOptions = {}
) {
	let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

	return (...args: any[]) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(() => {
			try {
				f(...args);
			} catch (err) {
				//swallow the error, there is no good way to signal failure to the caller
				log.error(err);
			}
		}, lingerMs);
	};
}
