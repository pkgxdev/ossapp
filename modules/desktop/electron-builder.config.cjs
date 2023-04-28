module.exports = {
  appId: "xyz.tea.gui",
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
      target: "default",
      arch: ["x64", "arm64"]
    }
  },
  // this determines the configuration of the auto-update feature
  publish: {
    provider: "generic",
    // TODO: replace this with tea branded domain: gui-dist.tea.xyz
    // url: "https://d2ovumu63qzbn6.cloudfront.net/"
    url: "https://s3.amazonaws.com/preview.gui.tea.xyz/release"
  }
};
