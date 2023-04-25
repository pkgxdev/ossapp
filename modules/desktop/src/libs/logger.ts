const log = window ? window.require("electron-log") : console;
import { captureException } from "./sentry";

// TODO: figure out how to detect if packaged
const oldError = log.error;
log.error = (...params: any[]) => {
	oldError(params);
	captureException(params[0].message);
};
log.info("not working");
export default log;
