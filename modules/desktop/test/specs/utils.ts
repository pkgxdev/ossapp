import testingLibraryWdio from "@testing-library/webdriverio";

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
    const installButton = await findButton(/^INSTALL |^UPDATE/);
    installButton.click();

    // install the latest version
    const versionInstallButton = (await screen.findByText(/(latest)/)) as unknown as HTMLElement;
    versionInstallButton.click();
  };

  return {
    screen,
    findButton,
    findPackageCardBySlug,
    packageDetailsLoaded,
    uninstallPackageIfNeeded,
    installLatestVersion
  };
}

export const sleep = (delayMs: number) => new Promise((resolve) => setTimeout(resolve, delayMs));
