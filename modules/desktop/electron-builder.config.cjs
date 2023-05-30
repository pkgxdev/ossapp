const { notarize } = require("@electron/notarize");
const fs = require("fs");
const path = require("path");
const otaClient = require("@crowdin/ota-client");
const _ = require("lodash");

const appBundleId = "xyz.tea.gui";
module.exports = {
  appId: appBundleId,
  productName: "tea",
  asar: false,
  directories: { output: "dist" },
  files: ["electron/dist/electron.cjs", { from: "build", to: "" }],
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
    background: "./installer-bg.png",
    window: {
      width: 588,
      height: 380
    },
    iconSize: 100,
    contents: [
      {
        x: 148,
        y: 190
      },
      {
        x: 448,
        y: 190,
        type: "link",
        path: "/Applications"
      }
    ]
  },
  afterSign: async (params) => {
    if (process.platform !== "darwin" || process.env.CSC_IDENTITY_AUTO_DISCOVERY === "false") {
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
        appBundleId,
        appPath,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD
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
