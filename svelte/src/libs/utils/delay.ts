// withDelay adds a delay before calling the provided function.
export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function withDelay<T>(f: () => T, delayMs: number) {
  await wait(delayMs)
  return f();
}
