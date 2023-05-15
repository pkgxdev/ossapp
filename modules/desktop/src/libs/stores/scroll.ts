import type { SideMenuOptions } from "$libs/types";
import { get, writable } from "svelte/store";

type ScrollValue = Record<SideMenuOptions, number>;

const defaultLimit = 18;

// keep track of the scroll position of each side menu filter so it's not lost after navigation
export default function initScrollStore() {
  const scrollPositions = writable<ScrollValue>({} as ScrollValue);
  const limits = writable<ScrollValue>({} as ScrollValue);

  return {
    setScrollPosition: (filter: SideMenuOptions, pos: number) => {
      scrollPositions.update((prev) => {
        prev[filter] = pos;
        return prev;
      });
    },
    getScrollPosition: (filter: SideMenuOptions) => {
      return get(scrollPositions)[filter] || 0;
    },
    setLimit: (filter: SideMenuOptions, limit: number) => {
      limits.update((prev) => {
        prev[filter] = limit;
        return prev;
      });
    },
    getLimit: (filter: SideMenuOptions) => {
      return get(limits)[filter] || defaultLimit;
    }
  };
}
