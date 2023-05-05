import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import path from "path";

const isMock = process.env.BUILD_FOR === "preview";

const config: UserConfig = {
  plugins: [sveltekit()],
  resolve: {
    alias: {
      "@tea/ui/*": path.resolve("../ui/src/*"),
      "@tea/libtea/*": path.resolve("../libtea/src/*"),
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
