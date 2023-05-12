import type { Options } from "@wdio/types";
import { join } from "path";
import { getDirname } from "cross-dirname";

const dirname = getDirname();
const productName = "tea";

process.env.TEST = "true";

export const config: Options.Testrunner = {
  runner: "local",
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: "./test/tsconfig.json",
      transpileOnly: true
    }
  },
  specs: ["./test/specs/**/*.e2e.ts"],
  exclude: [
    // 'path/to/excluded/files'
  ],
  maxInstances: 10,
  capabilities: [
    {
      // capabilities for local browser web tests
      browserName: "chrome" // or "firefox", "microsoftedge", "safari"
    }
  ],
  logLevel: "debug",
  bail: 0,
  baseUrl: "http://localhost",
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [
    [
      "electron",
      {
        appPath: join(dirname, "dist"),
        appName: productName,
        appArgs: [],
        chromedriver: {
          port: 9519,
          logFileName: "wdio-chromedriver.log"
        },
        electronVersion: "22.1.0"
      }
    ]
  ],
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: {
    ui: "bdd",
    timeout: 60000
  }
};
