import { browser } from "wdio-electron-service";
import { setupUtils, sleep } from "./utils.ts";

type utilType = ReturnType<typeof setupUtils>;

describe("basic smoke test", () => {
  let utils: utilType;

  beforeEach(async () => {
    utils = setupUtils(browser);
    await utils.goHome();
  });

  it("install brewkit from the made by tea tab", async () => {
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

    const closeNotificationBtn = $(".close-notification");
    await expect(closeNotificationBtn).toExist();
    await closeNotificationBtn.click();
    await expect(closeNotificationBtn).not.toExist();
  });

  it("search and install create-dmg", async () => {
    const { screen } = utils!;

    const fakeInput = await screen.findByTestId("topbar-search-input");
    await fakeInput.click();

    await (await screen.findByTestId("search-popup")).waitForExist();

    const searchInput = await screen.findByTestId("search-input-popup");
    await searchInput.setValue("create-dmg");

    const packageFullname = "github.com/create-dmg/create-dmg";
    const createDmgSlug = packageFullname.replace(/[^\w\s]/gi, "_").toLocaleLowerCase();
    const createDmgCard = await utils.findSearchPackageCardBySlug(createDmgSlug);
    await expect(createDmgCard).toExist();
    createDmgCard.click();

    await utils.packageDetailsLoaded();
    await utils.uninstallPackageIfNeeded();

    await utils.installLatestVersion();

    await expect(
      await screen.findByText(
        /^Package github.com\/create-dmg\/create-dmg .* has been installed./,
        {},
        { timeout: 60000, interval: 1000 }
      )
    ).toExist();

    const closeNotificationBtn = $(".close-notification");
    await expect(closeNotificationBtn).toExist();
    await closeNotificationBtn.click();
    await expect(closeNotificationBtn).not.toExist();
  });
});
