import * as testingLibraryWdio from "@testing-library/webdriverio";
import { sleep, waitForNotExist } from "./waitutils.ts";

// work around for importing CommonJS module
const { setupBrowser } = testingLibraryWdio;

//TODO: This should probably evolve into a "page object" pattern, but for now it's just a pile of utils
export function setupUtils(browser: WebdriverIO.Browser) {
  const screen = setupBrowser(browser as any);

  const findButton = async (name: RegExp | string) => {
    return (await screen.findByRole("button", { name })) as unknown as HTMLElement;
  };

  const findByTestId = async (testId: string) => {
    return await screen.findByTestId(testId, {}, { interval: 1000, timeout: 10000 });
  };

  //
  // Package List Page
  //

  // Find a package card on a package list screen
  const findPackageCardBySlug = async (slug: string) => {
    // Trying to find the anchor tag role doesn't work, so we have to find by test id of the div inside the anchor
    return (await screen.findByTestId(`package-card-${slug}`)) as unknown as HTMLElement;
  };

  //
  // Search Popup
  //

  // Find a package card on a package list screen
  const findSearchPackageCardBySlug = async (slug: string) => {
    // Trying to find the anchor tag role doesn't work, so we have to find by test id of the div inside the anchor
    return (await screen.findByTestId(`card-result-${slug}`)) as unknown as HTMLElement;
  };

  //
  // Package Details Page
  //
  const packageDetailsLoaded = async () => {
    // try to find the package banner header so we know the page is at least mostly loaded
    await screen.findByTestId("package-banner-header", {}, { timeout: 10000, interval: 500 });
  };

  const uninstallPackageIfNeeded = async () => {
    const uninstallButton = (await screen.queryByTestId(
      "uninstall-button"
    )) as unknown as HTMLElement;
    console.log(`will uninstall package = ${!!uninstallButton}`);
    if (uninstallButton) {
      uninstallButton.click();
      // wait for the uninstall button to disappear
      await waitForNotExist(() => screen.queryByTestId("uninstall-button"), { timeout: 20000 });
    }
  };

  const installLatestVersion = async (slug: string) => {
    await installSpecificVersion(slug, "latest");
  };

  const installSpecificVersion = async (slug: string, version: string) => {
    console.log(`Installing package: ${slug}@${version}`);

    const installButton = await findByTestId(`install-button-${slug}`);
    expect(installButton).toExist();
    installButton.click();

    const versionButton = await findByTestId(`install-${version}`);
    expect(versionButton).toExist();
    versionButton.click();
  };

  const goHome = async () => {
    const homeButton = await screen.findByTestId("home-button");
    await homeButton.click();
    const homeMenu = $("#side-menu");
    await homeMenu.waitForExist();
  };

  const searchTerm = async (term: string) => {
    const fakeInput = await screen.findByTestId("topbar-search-input");
    await fakeInput.click();

    await (await screen.findByTestId("search-popup")).waitForExist();

    const searchInput = await screen.findByTestId("search-input-popup");
    await searchInput.setValue(term);
  };

  const verifyInstalledBadge = async (
    slug: string,
    state: "INSTALLED" | "UPDATE" | "UPDATED" = "INSTALLED"
  ) => {
    // wait 60 seconds for the badge to show up
    for (let i = 0; i < 60; i++) {
      const badge = await findByTestId(`install-badge-${slug}`);
      expect(badge).toExist();

      const badgeText = (await badge.getText()).replace(/\n/g, " ");
      console.log(`verifying installed badge for ${slug}: ${badgeText}`);

      if (badgeText.includes(state)) {
        return;
      }
      await sleep(1000);
    }

    throw new Error(`Failed to find installed badge for ${slug}`);
  };

  return {
    screen,
    searchTerm,
    goHome,
    findButton,
    findByTestId,
    findPackageCardBySlug,
    findSearchPackageCardBySlug,
    packageDetailsLoaded,
    uninstallPackageIfNeeded,
    installLatestVersion,
    installSpecificVersion,
    verifyInstalledBadge
  };
}
