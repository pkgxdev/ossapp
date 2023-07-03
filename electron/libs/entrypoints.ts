import pty from "node-pty";

import log from "./logger";
import { MainWindowNotifier } from "./types";
import * as tea from "@teaxyz/lib";
import { GUIPackage } from "../../svelte/src/libs/types";
import { getPantryDetails } from "./pantry";
import { ipcMain } from "electron";

// the tea cli package is needed to open any other package in the terminal, so make sure it's installed and return the path
async function installTeaCli() {
  const installations = await tea.porcelain.install("tea.xyz");
  const install = installations.find((i) => i.pkg.project === "tea.xyz");
  if (!install) {
    throw new Error("installing tea/cli failed");
  }
  return install;
}

export interface Subprocess {
  pty: pty.IPty;
  output: string[];
  guiURL?: string;
}

const ptys: Record<string, Subprocess> = {};

// The main window must invoke this function to get the list of subprocesses and hydrate the store
export function sendSubprocessesSnapshot(notifyMainWindow: MainWindowNotifier) {
  const subprocesses: Record<
    string,
    { project: string; pid: number; output: string[]; guiURL?: string }
  > = {};
  Object.entries(ptys).forEach(([project, { pty, output, guiURL }]) => {
    subprocesses[project] = { project, pid: pty.pid, output, guiURL };
  });

  notifyMainWindow("pty.out", { type: "snapshot", subprocesses });
}

export async function openPackageEntrypointInTerminal(
  guipkg: GUIPackage,
  notifyMainWindow: MainWindowNotifier
) {
  const cli = await installTeaCli();
  const project = guipkg.full_name; //TODO make the naming in the API consistent with libtea and tea/cli thanks

  if (project in ptys) {
    log.info(`a process for project ${project} is already running`);
    return;
  }

  log.info(`opening project ${project} in terminal using tea/cli at ${cli.path}`);

  // look up the entrypoint for the package again in case it changed. This makes
  // hacking on the entrypoint more ergonomic for local, third party developers
  let { entrypoint } = await getPantryDetails(project);
  entrypoint ??= `tea +${project} sh`;

  notifyMainWindow("pty.out", { project, type: "reset" });

  const installation = await tea.hooks
    .useCellar()
    .resolve({ project, constraint: new tea.semver.Range("*") });
  const shell =
    process.platform === "win32" ? "powershell.exe" : process.platform == "darwin" ? "zsh" : "bash";
  const wet = await tea.plumbing.hydrate(installation.pkg);
  const gas = await tea.plumbing.resolve(wet.pkgs);
  if (gas.pending.length) throw new Error("pkg dependencies not installed");
  const cwd = installation.path.string;

  const installations = gas.installed;
  if (!installations.some(({ pkg: { project } }) => project == "tea.xyz")) {
    // dont’t dupe tea/cli if it’s already a dep
    // ∵ useShellEnv is plumbing and thus will happily dupe env
    installations.push(cli);
  }

  const rawenv = await tea.hooks.useShellEnv().map({ installations });
  const env = tea.hooks.useShellEnv().flatten(rawenv);
  env.PATH += ":/usr/bin:/bin";
  env.TMPDIR ??= process.env.TMPDIR ?? "error";
  env.HOME ??= process.env.HOME ?? "error";
  env.TEA_GUI = "1";

  /// user env is likely to screw up our env configuration
  const args = ["--no-rcs"];

  const ptyproc = pty.spawn(shell, args, {
    name: "xterm-color", //NOTE just copied this from the docs so dunno if it’s a good choice or what
    cwd, //TODO probs not a good CWD choice, probs make a new dir for each project in our tmpdir
    env
  });

  ptyproc.onData((out) => {
    ptys[project].output.push(out);

    if (out.startsWith('{"xyz.tea":')) {
      //FIXME bit flakey (this system)
      const json = JSON.parse(out);
      const url = json["xyz.tea"]?.["gui"];
      if (url) {
        ptys[project].guiURL = url;
        notifyMainWindow("pty.out", { project, type: "enable-gui", guiURL: url });
      }
    }

    notifyMainWindow("pty.out", {
      project,
      pid: ptyproc.pid,
      out,
      type: "out"
    });
  });

  const inputListener = (event, { data, project: incoming_project }) => {
    if (project === incoming_project) {
      ptyproc.write(data);
    }
  };

  ptyproc.onExit(({ exitCode }) => {
    ipcMain.removeListener("pty.in", inputListener);
    delete ptys[project];

    notifyMainWindow("pty.out", {
      pid: ptyproc.pid,
      project,
      out: `exited with ${exitCode}`,
      type: "out"
    });
  });

  ptyproc.write(`${entrypoint}\r`);

  ipcMain.addListener("pty.in", inputListener);

  ptys[project] = { pty: ptyproc, output: [] };
}
