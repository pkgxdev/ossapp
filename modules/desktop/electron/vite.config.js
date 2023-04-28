import { join } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

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
    sourcemap: "inline",
    outDir: "dist",
    assetsDir: ".",
    minify: process.env.MODE !== "development",
    lib: {
      entry: "electron.ts",
      formats: ["cjs"]
    },
    rollupOptions: {
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
    })
  ]
};

export default config;
