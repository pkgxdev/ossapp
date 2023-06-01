import { authFileState } from "./auth";

type InitState = "NOT_INITIALIZED" | "PENDING" | "INITIALIZED";

export class InitWatcher<T> {
  private initState: InitState;
  private initFunction: () => Promise<T>;
  private initializationPromise: Promise<T> | undefined;

  constructor(initFunction: () => Promise<T>) {
    this.initState = "NOT_INITIALIZED";
    this.initFunction = initFunction;
    this.initializationPromise = undefined;
  }

  async initialize(): Promise<T> {
    if (this.initState === "NOT_INITIALIZED") {
      this.initState = "PENDING";
      this.initializationPromise = this.retryFunction(this.initFunction, 3)
        .then((value) => {
          this.initState = "INITIALIZED";
          return value;
        })
        .catch((error) => {
          this.initState = "NOT_INITIALIZED";
          this.initializationPromise = undefined;
          throw error;
        });
    }

    return this.initializationPromise as Promise<T>;
  }

  async retryFunction(func: () => Promise<T>, retries: number, currentAttempt = 1): Promise<T> {
    try {
      const result = await func();
      return result;
    } catch (error) {
      if (currentAttempt < retries) {
        return this.retryFunction(func, retries, currentAttempt + 1);
      } else {
        throw error;
      }
    }
  }

  reset(): void {
    this.initState = "NOT_INITIALIZED";
    this.initializationPromise = undefined;
  }

  async observe(): Promise<T> {
    return await this.initialize();
  }

  getState(): InitState {
    return this.initState;
  }
}
export default async function initialize() {
  await authFileState.observe();
}
