// as much possible add types here that are unique to @tea/desktop use only
// else
// 		please use the package @tea/ui/src/types.ts
//		things that go there are shared types/shapes like ie: Package

import type { Package, Developer } from "@tea/ui/types";

export enum PackageStates {
  AVAILABLE = "AVAILABLE",
  INSTALLED = "INSTALLED",
  INSTALLING = "INSTALLING",
  NEEDS_UPDATE = "NEEDS_UPDATE",
  UPDATING = "UPDATING"
}

// PackageDisplayState is for showing temporary UI elements when a package is installed or updated. It is not persisted.
export interface PackageDisplayState {
  // INSTALLED_SUCCESSFULLY -> The pacakge was installed successfully show some confetti!
  // UPDATED_SUCCESSFULLY -> The package was updated successfully change the badge temporarily
  // INSTALLATION_ERROR -> The package failed to install show an error overlay temporarily
  kind: "INSTALLED_SUCCESSFULLY" | "UPDATED_SUCCESSFULLY" | "INSTALLATION_ERROR";
  errorMessage?: string;
  version: string;
}

export type Packages = {
  version: string;
  packages: { [full_name: string]: GUIPackage };
};

export type GUIPackage = Package & {
  state: PackageStates;
  installed_versions?: string[];
  synced?: boolean;
  install_progress_percentage?: number;
  isUninstalling?: boolean;
  cached_image_url?: string;

  displayState?: PackageDisplayState | null;
};

export type Course = {
  title: string;
  sub_title: string;
  banner_image_url: string;
  link: string;
};

export type Category = {
  label: string;
  cta_label: string;
  packages: GUIPackage[];
};

export enum AuthStatus {
  UNKNOWN = "UNKNOWN",
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED"
}

export type DeviceAuth = {
  status: AuthStatus;
  user?: Developer;
  key: string;
};
export interface Session {
  device_id?: string;
  key?: string;
  user?: Developer;
  locale?: string;
  teaVersion?: string;
}

export enum SideMenuOptions {
  discover = "discover",
  all = "all",
  installed = "installed",
  installed_updates_available = "installed_updates_available",
  recently_updated = "recently_updated",
  new_packages = "new_packages",
  popular = "popular",
  featured = "featured",
  essentials = "essentials",
  starstruck = "starstruck",
  made_by_tea = "made_by_tea"
}

export type InstalledPackage = Required<Pick<GUIPackage, "full_name" | "installed_versions">>;

export type AutoUpdateStatus = {
  status: "up-to-date" | "available" | "ready";
  version?: string;
};
