import log from "$libs/logger";

export type RetryOptions = {
  // Number of times to retry. default 10
  maxRetries?: number;
  // Initial delay in ms. default 100
  initialDelayMs?: number;
  // Maximum delay in ms. default 5000
  maxDelayMs?: number;
};

// Retry a function up to maxRetries times, with exponential backoff
// With defaults retry cadence will look like this:
// 100ms, 200ms, 400ms, 800ms, 1600ms, 3200ms, 5000ms, 5000ms, 5000ms, 5000ms
export default async function withRetry<T>(
  fn: () => Promise<T>,
  { maxRetries = 10, initialDelayMs = 100, maxDelayMs = 5000 }: RetryOptions = {}
) {
  let retries = 0;
  let currentDelay = initialDelayMs;
  while (retries <= maxRetries) {
    try {
      return await fn();
    } catch (err) {
      log.error(err);
      retries++;
      await wait(currentDelay);
      currentDelay = Math.min(currentDelay * 2, maxDelayMs);
    }
  }
  throw new Error(`Failed after ${maxRetries} retries`);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
