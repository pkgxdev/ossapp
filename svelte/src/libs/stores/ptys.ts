import log from "$libs/logger";
import { listenToChannel } from "@native";
import { writable } from "svelte/store";

const store = writable<Record<string, TeaSubprocess>>({});

export interface TeaSubprocess {
  project: string;
  pid: number;
  output: string[];
  guiURL?: string;
}

interface SnapshotMessage {
  type: "snapshot";
  subprocesses: Record<string, TeaSubprocess>;
}

interface OutputMessage {
  project: string;
  type: "out";
  pid: number;
  out: string;
}

interface ResetMessage {
  project: string;
  type: "reset";
}

interface EnableGUIMessage {
  project: string;
  type: "enable-gui";
  guiURL: string;
}

type Incoming = SnapshotMessage | OutputMessage | ResetMessage | EnableGUIMessage;

listenToChannel("pty.out", (msg: Incoming) => {
  if (msg.type === "snapshot") {
    log.info("received new subprocess snapshot");
    const { subprocesses } = msg;
    store.update((_store) => {
      return subprocesses;
    });
  } else if (msg.type === "out") {
    const { project, pid, out } = msg;
    store.update((store) => {
      store[project] ??= { project, pid: pid ?? 0, output: [] };
      store[project].output.push(out);
      return store;
    });
  } else if (msg.type === "enable-gui") {
    const { project, guiURL } = msg;
    log.info(`enabling gui for project ${project} at ${guiURL}`);
    store.update((store) => {
      if (store[project]) {
        store[project].guiURL = guiURL;
      }
      return store;
    });
  } else if (msg.type === "reset") {
    const { project } = msg;
    store.update((store) => {
      delete store[project];
      return store;
    });
  }
});

export default {
  ptyStore: store,
  subscribeToSubprocess: (project: string, callback: (process: TeaSubprocess) => void) => {
    return store.subscribe((store) => {
      if (store[project]) {
        callback(store[project]);
      }
    });
  }
};
