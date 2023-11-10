import { expect, describe, beforeEach, afterEach, test, vi } from "vitest";
import withDelay from "./delay";

describe("withDelay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should delay time to execute callback", async () => {
    const callback = vi.fn();
    const timer = 100;
    const promise = withDelay(callback, timer);
    expect(callback).not.toHaveBeenCalled();
    vi.runAllTimers();
    await promise;
    expect(callback).toHaveBeenCalled();
  });

  test("should return the result of callback", async () => {
    const result = "result";
    const callback = vi.fn().mockImplementation(() => result);
    const promise = withDelay(callback, 0);
    vi.runAllTimers();
    expect(await promise).toEqual(result);
  });
});
