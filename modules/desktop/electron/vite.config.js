import { join } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { version } from "../package.json";

const PACKAGE_ROOT = __dirname;
const PROJECT_ROOT = join(PACKAGE_ROOT, "../..");

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    alias: {
      "/@/": join(PACKAGE_ROOT, "src") + "/"
    }
  },
  build: {
    ssr: true,
    sourcemap: true,
    outDir: "dist",
    assetsDir: ".",
    minify: false,
    lib: {
      entry: "electron.ts",
      formats: ["cjs"]
    },
    rollupOptions: {
      external: ["@teaxyz/lib/src/**/*"],
      output: {
        entryFileNames: "[name].cjs"
      }
    },
    emptyOutDir: true,
    reportCompressedSize: false
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "./preload.cjs",
          dest: "."
        }
      ]
    }),
    process.env.SENTRY_AUTH_TOKEN &&
      sentryVitePlugin({
        org: "tea-inc",
        project: "electron",
        authToken: process.env.SENTRY_AUTH_TOKEN,
        sourcemaps: {
          assets: "./dist/**"
        },
        release: version
      })
  ]
};

export default config;
