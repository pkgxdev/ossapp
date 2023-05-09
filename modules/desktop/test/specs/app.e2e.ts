import { browser } from "wdio-electron-service";
import { setupUtils } from "./utils.ts";

describe("basic smoke test", () => {
  it("install brewkit from the made by tea tab", async () => {
    const utils = setupUtils(browser);
    const { screen } = utils!;

    // app launches to discover screen by default - make sure Stable Diffusion is there
    await expect(await screen.findByText("Stable Diffusion web UI")).toExist();

    // navigate to "made by tea" page
    const btn = await utils.findButton("made by tea");
    btn.click();

    // find the brewkit package
    const pkgCard = await utils.findPackageCardBySlug("tea_xyz_brewkit");
    pkgCard.click();

    await utils.packageDetailsLoaded();

    // Be nice to devs running this over and over
    await utils.uninstallPackageIfNeeded();

    await utils.installLatestVersion();

    //use findByText to wait for the install to complete
    await expect(
      await screen.findByText(
        /^Package tea.xyz\/brewkit .* has been installed./,
        {},
        { timeout: 60000, interval: 1000 }
      )
    ).toExist();
    await expect(await screen.findByRole("button", { name: "OPEN IN TERMINAL" })).toExist();
  });
});
