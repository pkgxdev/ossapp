import type { TabId } from "$libs/types";
import { writable } from "svelte/store";

export default function initTabStore() {
  const activeTab = writable<TabId>();

  return {
    activeTab,
    setActiveTab: (id: TabId) => {
      activeTab.set(id);
    }
  };
}
