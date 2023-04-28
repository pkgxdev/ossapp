import type { AutoUpdateStatus } from "$libs/types";
import { getAutoUpdateStatus, listenToChannel } from "@native";
import { writable } from "svelte/store";

export default function initAppUpdateStore() {
  const updateStatus = writable<AutoUpdateStatus>({ status: "up-to-date" });

  getAutoUpdateStatus().then((status: AutoUpdateStatus) => {
    updateStatus.update(() => status);
  });

  listenToChannel("app-update-status", (status: AutoUpdateStatus) => {
    if (status.status) {
      updateStatus.update(() => status);
    }
  });

  return {
    updateStatus
  };
}
