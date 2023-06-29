// withDelay adds a delay before calling the provided function.
export default async function withDelay<T>(f: () => T, delayMs: number) {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return f();
}
