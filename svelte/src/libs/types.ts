export interface Review {
  title: string;
  comment: string;
  rating: number;
  created_at?: Date | string;
}
export interface Package {
  slug: string;
  // TODO:  this field should be deprecated and instead be presented as a latest version PER architecture
  version: string;
  full_name: string;
  name: string;
  maintainer: string;
  homepage: string;
  updated_at: Date | string;
  created_at: Date | string;
  dl_count: number;
  installs: number;
  reviews?: Review[];
  package_yml_url?: string;
  categories: string[];
  // metas
  full_description?: string; // probably markdown
  bottles?: Bottle[];
  license?: string;
  size_bytes?: number;
  documentation_url?: string;
  github_url?: string;
  contributors?: Contributor[];
  readme?: {
    data: string;
    type: "md" | "rst" | "html";
  };
  manual_sorting: number;
  card_layout: "bottom" | "right" | "left";
  image_added_at: Date | null;
  keywords: string[];
  description: string;
  short_description: string;
}

export type AirtablePost = {
  airtable_record_id: string;
  title: string;
  link: string;
  sub_title: string;
  short_description: string;
  thumb_image_url: string;
  thumb_image_name: string;
  created_at: Date;
  updated_at: Date;
  published_at: Date;
  tags: string[];
};

export type Developer = {
  developer_id: string;
  avatar_url?: string;
  name: string;
  login: string;
  country?: string;
  wallet?: string;
};

export type Bottle = {
  name: string;
  platform: string;
  arch: string;
  version: string;
  bytes: number;
  updated_at?: Date | string;
};

export type Snippet = {
  snippet_id: string;
  created_at: Date | string;
  user: string;
  avatar_url?: string;
  stars: number;
  files: {
    name: string;
    data: string;
    language: string;
  }[];
  forks: Partial<Snippet>[];
  comments: {
    user: string;
    comment: string;
  }[];
};

export type Contributor = Pick<Developer, "avatar_url" | "login" | "name"> & {
  github_id: number;
  developer_id?: string;
  contributions: number;
};

export interface ListActionItem {
  title: string;
  sub_title: string;
  image_url: string;
  action_label: string;
  detail_url?: string;
}

export enum NotificationType {
  MESSAGE,
  ACTION_BANNER,
  ERROR
}
export interface Notification {
  id: string;
  i18n_key?: string;
  message: string;
  type: NotificationType;
  callback_label?: string;
  callback?: () => void;
  params?: { [key: string]: string };
}

export enum PackageStates {
  AVAILABLE = "AVAILABLE",
  INSTALLED = "INSTALLED",
  INSTALLING = "INSTALLING",
  NEEDS_UPDATE = "NEEDS_UPDATE",
  UPDATING = "UPDATING"
}

// PackageDisplayState is a TEMPORARY state for showing temporary UI elements when a package is
// installed or updated. It is not persisted.
export interface PackageDisplayState {
  // INSTALLED -> The package was installed successfully. Let's show some confetti!
  // UPDATED -> The package was updated successfully so change the badge temporarily
  // ERROR -> The package failed to install so show an error overlay temporarily
  state: "INSTALLED" | "UPDATED" | "ERROR";
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
  image_512_url?: string;
  image_128_url?: string;
  displayState?: PackageDisplayState | null;
  // pantry properties
  display_name?: string;
  entrypoint?: string;
  provides?: string[];
  // a flag to indicate if the package is local and not from the pantry
  is_local?: boolean;
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
  made_by_tea = "made_by_tea",
  local = "local_packages"
}

export type InstalledPackage = Required<Pick<GUIPackage, "full_name" | "installed_versions">>;

export type AutoUpdateStatus = {
  status: "up-to-date" | "available" | "ready";
  version?: string;
};

export const defaultImgUrl = "/images/default-thumb.jpg";
