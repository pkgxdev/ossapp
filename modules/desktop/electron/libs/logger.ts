import log from "electron-log";

export const setSentryLogging = (sentry: any) => {
  const oldError = log.error;

  log.error = (...params: any[]) => {
    if (process.env.TEST === "true") {
      log.info(params);
      return;
    }

    oldError(params);
    sentry.captureException(params[0].message);
  };
};

// Export the log object to use it throughout the app
export default log;
