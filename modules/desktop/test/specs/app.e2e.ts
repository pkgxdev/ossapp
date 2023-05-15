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

    await utils.closeNotification();
  });

  it("search and install create-dmg", async () => {
    const { screen, searchTerm } = utils!;
    await searchTerm("create-dmg");

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

    await utils.closeNotification();
  });

  it("should be able to install specific version", async () => {
    const { screen, searchTerm } = utils!;
    await searchTerm("pnpm.io");
    const pnpmCard = await utils.findSearchPackageCardBySlug("pnpm_io");
    await expect(pnpmCard).toExist();
    pnpmCard.click();

    await utils.uninstallPackageIfNeeded();

    await utils.installSpecificVersion("8.0.0");

    await expect(
      await screen.findByText(
        /^Package pnpm.io .* has been installed./,
        {},
        { timeout: 60000, interval: 1000 }
      )
    ).toExist();

    await utils.closeNotification();
  });

  it("should be able to update a package", async () => {
    // this requires ^ to succeed first
    const { screen } = utils!;
    const menuBtn = await screen.findByTestId("menu-button-updates-available");
    menuBtn.click();

    const header = await screen.findByText("available updates");
    await expect(header).toExist();

    const updateBtn = await screen.findByTestId("install-button-pnpm_io");
    await expect(updateBtn).toExist();

    updateBtn.click();

    await expect(
      await screen.findByText(
        /^Package pnpm.io .* has been installed./,
        {},
        { timeout: 60000, interval: 1000 }
      )
    ).toExist();

    await utils.closeNotification();
  });
});
