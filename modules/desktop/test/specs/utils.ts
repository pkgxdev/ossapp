import * as testingLibraryWdio from "@testing-library/webdriverio";

// work around for importing CommonJS module
const { setupBrowser } = testingLibraryWdio;

//TODO: This should probably evolve into a "page object" pattern, but for now it's just a pile of utils
export function setupUtils(browser: WebdriverIO.Browser) {
  const screen = setupBrowser(browser as any);

  const findButton = async (name: RegExp | string) => {
    return (await screen.findByRole("button", { name })) as unknown as HTMLElement;
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
    const uninstallButton = (await screen.queryByRole("button", {
      name: "UNINSTALL"
    })) as unknown as HTMLElement;
    if (uninstallButton) {
      uninstallButton.click();
      // wait for the install button to show back up
      await screen.findByRole("button", { name: /^INSTALL / }, { timeout: 60000, interval: 1000 });
    }
  };

  const installLatestVersion = async () => {
    await installSpecificVersion("latest");
  };

  const installSpecificVersion = async (version: string) => {
    const installButton = await findButton(/^INSTALL |^UPDATE/);
    installButton.click();

    const versionButton = await screen.findByTestId(`install-${version}`);
    await versionButton.waitForExist();
    versionButton.click();
  };

  const goHome = async () => {
    // await browser.url("/");
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

  const closeNotification = async () => {
    const closeNotificationBtn = $(".close-notification");
    await expect(closeNotificationBtn).toExist();
    await closeNotificationBtn.click();
    await expect(closeNotificationBtn).not.toExist();
  };

  return {
    screen,
    searchTerm,
    goHome,
    findButton,
    findPackageCardBySlug,
    findSearchPackageCardBySlug,
    packageDetailsLoaded,
    uninstallPackageIfNeeded,
    installLatestVersion,
    installSpecificVersion,
    closeNotification
  };
}

export const sleep = (delayMs: number) => new Promise((resolve) => setTimeout(resolve, delayMs));
