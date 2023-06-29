export const sleep = (delayMs: number) => new Promise((resolve) => setTimeout(resolve, delayMs));

export type WaitOpts = { timeout?: number; interval?: number };

// wait for a query to return a non-truthy value
export const waitForNotExist = async (
  query: () => Promise<WebdriverIO.Element | null>,
  opts: WaitOpts = {}
) => {
  return waitFor(async () => await expect(await query()).not.toExist(), opts);
};

export const waitFor = async (
  action: () => Promise<void>,
  { interval = 1000, timeout = 5000 }: WaitOpts = {}
) => {
  const start = Date.now();
  let lastErr;

  console.log("Wait For", { interval, timeout });

  while (Date.now() - start < timeout) {
    try {
      await action();
      return;
    } catch (e) {
      // swallow it and keep trying
      lastErr = e;
    }
    await sleep(interval);
  }

  throw new Error(`waitFor timed out. Last error: ${lastErr}`);
};
