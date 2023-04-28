const log = window ? window.require("electron-log") : console;
import { captureException } from "./sentry";

// TODO: figure out how to detect if pkaged
const oldError = log.error;
log.error = (...params: any[]) => {
  oldError(params);
  captureException(params[0].message);
};
export default log;
