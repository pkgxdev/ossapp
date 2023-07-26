import { browser } from "wdio-electron-service";
import { setupUtils } from "./utils.ts";
import { sleep } from "./waitutils.js";

type utilType = ReturnType<typeof setupUtils>;

// might need to update this from time to time
const disoverText = "GPT Engineer";

describe("basic smoke test", () => {
  let utils: utilType;

  beforeEach(async () => {
    utils = setupUtils(browser);
    await utils.goHome();
    await (await utils.screen.findByText(disoverText)).waitForExist();

    // fuse indexing takes time
    await sleep(4000);
  });

  it("install brewkit from the made by tea tab", async () => {
    const { screen } = utils!;

    const slug = "tea_xyz_brewkit";

    // app launches to discover screen by default - make sure Stable Diffusion is there
    await expect(await screen.findByText(disoverText)).toExist();

    // navigate to "made by tea" page
    const btn = await utils.findButton("made by tea");
    btn.click();

    // find the brewkit package
    const pkgCard = await utils.findPackageCardBySlug(slug);
    pkgCard.click();

    await utils.packageDetailsLoaded();

    // Be nice to devs running this over and over
    await utils.uninstallPackageIfNeeded();

    await utils.installLatestVersion(slug);

    await utils.verifyInstalledBadge(slug);
    await expect(await screen.findByRole("button", { name: "OPEN IN TERMINAL" })).toExist();
  });

  it("search and install create-dmg", async () => {
    const { searchTerm } = utils!;
    await searchTerm("create-dmg");

    const packageFullname = "github.com/create-dmg/create-dmg";
    const createDmgSlug = packageFullname.replace(/[^\w\s]/gi, "_").toLocaleLowerCase();
    const createDmgCard = await utils.findSearchPackageCardBySlug(createDmgSlug);
    await expect(createDmgCard).toExist();
    createDmgCard.click();

    await utils.packageDetailsLoaded();
    await utils.uninstallPackageIfNeeded();

    await utils.installLatestVersion(createDmgSlug);
    await utils.verifyInstalledBadge(createDmgSlug);
  });

  it("should be able to install specific version", async () => {
    const { screen, searchTerm } = utils!;
    const slug = "gnu_org_grep";

    await searchTerm("grep");
    const grepCard = await utils.findSearchPackageCardBySlug(slug);
    await expect(grepCard).toExist();
    grepCard.click();

    await utils.uninstallPackageIfNeeded();
    await utils.installSpecificVersion(slug, "3.8.0");

    // since we're installing an old version verify the badge says UPDATE
    await utils.verifyInstalledBadge(slug, "UPDATE");

    // Now test the update
    await utils.goHome();

    const menuBtn = await screen.findByTestId("menu-button-updates-available");
    menuBtn.click();

    const header = await screen.findByText("available updates");
    await expect(header).toExist();

    const updateBtn = await utils.findByTestId("install-button-gnu_org_grep");
    await expect(updateBtn).toExist();
    updateBtn.click();

    await utils.verifyInstalledBadge(slug, "UPDATED");
  });
});
