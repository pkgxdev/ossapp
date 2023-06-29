import { sveltekit } from "@sveltejs/kit/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import type { UserConfig } from "vite";
import path from "path";
import { version } from "../package.json";

const isMock = process.env.BUILD_FOR === "preview";

const config: UserConfig = {
  build: {
    sourcemap: true
  },
  plugins: [
    sveltekit(),
    process.env.SENTRY_AUTH_TOKEN &&
      sentryVitePlugin({
        org: "tea-inc",
        project: "electron",
        authToken: process.env.SENTRY_AUTH_TOKEN,
        sourcemaps: {
          assets: "./build/**"
        },
        release: version
      })
  ],
  resolve: {
    alias: {
      // this dynamic-ish static importing is followed by the svelte build
      // but for vscode editing intellisense tsconfig.json is being used
      "@native": isMock
        ? path.resolve("./src/libs/native-mock.ts")
        : path.resolve("./src/libs/native-electron.ts"),
      $components: path.resolve("./src/components"),
      $libs: path.resolve("./src/libs"),
      $appcss: path.resolve("./src/app.css")
    }
  },
  server: {
    port: 3000,
    fs: {
      allow: [".."]
    }
  },
  test: {
    // Jest like globals
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.ts"],
    // Extend jest-dom matchers
    setupFiles: ["./setupTest.js"],
    coverage: {
      provider: "c8"
    }
  }
};

export default config;
