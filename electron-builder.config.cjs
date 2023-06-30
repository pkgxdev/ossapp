const { notarize } = require("@electron/notarize");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const appBundleId = "xyz.tea.gui";
module.exports = {
  appId: appBundleId,
  productName: "tea",
  asar: false,
  directories: { output: "dist" },
  files: ["electron/dist/electron.cjs", { from: "svelte/build", to: "" }],
  linux: {
    icon: "./icon.png"
  },
  mac: {
    icon: "./electron/icon.icns",
    target: {
      target: process.env.MAC_BUILD_TARGET || "default",
      arch: ["x64", "arm64"]
    },
    minimumSystemVersion: "11"
  },
  dmg: {
    background: "./electron/bg.png",
    window: {
      width: 684,
      height: 465
    },
    iconSize: 128,
    contents: [
      {
        x: 158,
        y: 219
      },
      {
        x: 528,
        y: 219,
        type: "link",
        path: "/Applications"
      }
    ]
  },
  afterSign: async (params) => {
    const shouldNotarize =
      process.env.NOTARIZE === "true" || process.env.CSC_IDENTITY_AUTO_DISCOVERY === "true";
    if (process.platform !== "darwin" || !shouldNotarize) {
      console.log("not notarizing app");
      return;
    }

    console.log("afterSign hook triggered");

    let appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);
    if (!fs.existsSync(appPath)) {
      console.log("skip");
      return;
    }

    console.log(
      `Notarizing ${appBundleId} found at ${appPath} with Apple ID ${process.env.APPLE_ID}`
    );

    try {
      await notarize({
        tool: "noatrytool",
        appBundleId,
        appPath,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
        teamId: process.env.APPLE_TEAM_ID
      });
    } catch (error) {
      console.error(error);
    }

    console.log(`Done notarizing`);
  },
  // this determines the configuration of the auto-update feature
  publish: {
    provider: "generic",
    url: process.env.PUBLISH_URL || "https://gui.tea.xyz/release"
  }
};
