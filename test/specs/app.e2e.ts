import { browser } from "wdio-electron-service";
import { setupUtils } from "./utils.ts";
import { sleep, waitForExist } from "./waitutils.js";

type utilType = ReturnType<typeof setupUtils>;

// might need to update this from time to time
const disoverText = "local AI essentials";

describe("basic smoke test", () => {
  let utils: utilType;

  beforeEach(async () => {
    utils = setupUtils(browser);
    await utils.goHome();
    await sleep(4000);
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

    const updateBtn = await utils.findByTestId("install-badge-gnu_org_grep");
    await expect(updateBtn).toExist();
    updateBtn.click();

    const openBtn = await utils.findByTestId("open-gnu_org_grep");
    await expect(openBtn).toExist();
  });
});
