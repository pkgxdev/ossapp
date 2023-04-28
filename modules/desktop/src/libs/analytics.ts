import mixpanel from "mixpanel-browser";
import * as pub from "$env/static/public";
import { getSession } from "@native";

type DefaultMixpanelProps = {
  device_id: string;
  uid: string;
  distinct_id: string;
  locale: string;
  gui_version: string;
};
let mixpanelDefaultData: DefaultMixpanelProps;
const getLocalSession = async (): Promise<DefaultMixpanelProps> => {
  if (mixpanelDefaultData) return mixpanelDefaultData;
  const session = await getSession();
  mixpanelDefaultData = {
    device_id: session?.device_id || "unregistered",
    uid: session?.user?.developer_id || "unauthenticated",
    distinct_id: session?.device_id || "unregistered",
    locale: session?.locale || "unknown",
    gui_version: pub.PUBLIC_VERSION
  };
  return mixpanelDefaultData;
};

mixpanel.init(pub.PUBLIC_MIXPANEL_TOKEN, { debug: true });

enum AnalyticsAction {
  install = "INSTALL_ACTION",
  install_failed = "INSTALL_ACTION_FAILED",
  search = "SEARCH_ACTION",
  search_failed = "SEARCH_ACTION_FAILED"
}

const trackAction = (action: AnalyticsAction, data?: { [key: string]: any }) => {
  getLocalSession()
    .then((props) => {
      mixpanel.track(action, {
        ...(data || {}),
        ...props
      });
    })
    .catch((error) => {
      // TODO: log remote error stream
      console.error(error);
    });
};

/**
 * save success installation event to mixpanel
 * @param packageFullname full installation name of the package
 * @returns void
 */
export const trackInstall = (packageFullname: string) =>
  trackAction(AnalyticsAction.install, { pkg: packageFullname });

/**
 * save failed installation event to mixpanel
 * @param packageFullname full installation name of the package
 * @param error error message
 */
export const trackInstallFailed = (packageFullname: string, error: string) => {
  trackAction(AnalyticsAction.install_failed, {
    pkg: packageFullname,
    error
  });
};

export const trackSearch = (search_term: string, result_count: number) => {
  if (result_count > 0) {
    trackAction(AnalyticsAction.search, {
      search_term,
      result_count
    });
  } else {
    trackAction(AnalyticsAction.search_failed, {
      search_term
    });
  }
};
