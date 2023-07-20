/**
 * primarily used to make this desktop app work in the website preview setting in the CI/CD
 * may contain fake/mock data
 *
 * TODO:
 *  * make cors work with app.tea.xyz/v1
 */
import type { Package, Review, AirtablePost } from "$libs/types";
import type { GUIPackage, Session, Packages, AutoUpdateStatus } from "./types";
import { PackageStates } from "./types";
import { loremIpsum } from "lorem-ipsum";
import _ from "lodash";

const packages: Package[] = [
  {
    slug: "mesonbuild_com",
    homepage: "https://mesonbuild.com",
    name: "mesonbuild.com",
    version: "0.63.3",
    last_modified: "2022-10-06T15:45:08.000Z",
    full_name: "mesonbuild.com",
    dl_count: 270745,
    maintainer: "",
    description: "Fast and user-friendly build system",
    short_description: "Fast and user-friendly",
    keywords: [],
    installs: 0,
    categories: ["foundation_essentials"],
    created: "2022-10-06T15:45:08.000Z",
    manual_sorting: 0,
    card_layout: "bottom",
    image_added_at: new Date()
  },
  {
    slug: "pixman_org",
    homepage: "http://www.pixman.org/",
    name: "pixman.org",
    version: "0.40.0",
    last_modified: "2022-09-26T19:37:47.000Z",
    full_name: "pixman.org",
    dl_count: 0,
    maintainer: "freedesktop",
    description: "Pixman is a library for pixel manipulation, compositing, and rasterization",
    short_description: "Pixel manipulation library",
    keywords: [],
    installs: 0,
    categories: ["foundation_essentials"],
    created: "2022-09-26T19:37:47.000Z",
    manual_sorting: 1,
    card_layout: "bottom",
    image_added_at: new Date()
  },
  {
    slug: "freedesktop_org_pkg_config",
    homepage: "https://freedesktop.org",
    maintainer: "freedesktop.org",
    name: "pkg-config",
    version: "0.29.2",
    last_modified: "2022-10-20T01:32:15.000Z",
    full_name: "freedesktop.org/pkg-config",
    dl_count: 2661501,
    description: "Manage compile and link flags for libraries",
    short_description: "Manage compile and link flags for libraries",
    keywords: [],
    installs: 0,
    categories: ["foundation_essentials"],
    created: "2022-10-20T01:32:15.000Z",
    manual_sorting: 2,
    card_layout: "bottom",
    image_added_at: new Date()
  },
  {
    slug: "gnu_org_gettext",
    homepage: "https://gnu.org",
    maintainer: "gnu.org",
    name: "gettext",
    version: "0.21.1",
    last_modified: "2022-10-20T01:23:46.000Z",
    full_name: "gnu.org/gettext",
    dl_count: 3715970,
    description: "Manage compile and link flags for libraries",
    short_description: "Manage compile and link flags for libraries",
    keywords: [],
    installs: 0,
    categories: ["foundation_essentials"],
    created: "2022-10-20T01:23:46.000Z",
    manual_sorting: 3,
    card_layout: "bottom",
    image_added_at: new Date()
  },
  {
    slug: "ipfs_tech",
    homepage: "https://ipfs.tech",
    name: "ipfs.tech",
    version: "0.16.0",
    last_modified: "2022-10-19T21:36:52.000Z",
    full_name: "ipfs.tech",
    dl_count: 14457,
    maintainer: "",
    description: "Manage compile and link flags for libraries",
    short_description: "Manage compile and link flags for libraries",
    keywords: [],
    installs: 0,
    categories: ["foundation_essentials"],
    created: "2022-10-19T21:36:52.000Z",
    manual_sorting: 4,
    card_layout: "bottom",
    image_added_at: new Date()
  },
  {
    slug: "nixos_org_patchelf",
    homepage: "https://nixos.org",
    maintainer: "nixos.org",
    name: "patchelf",
    version: "0.15.0",
    last_modified: "2022-09-27T04:50:44.000Z",
    full_name: "nixos.org/patchelf",
    dl_count: 0,
    description: "Manage compile and link flags for libraries",
    short_description: "Manage compile and link flags for libraries",
    keywords: [],
    installs: 0,
    categories: ["top_packages", "foundation_essentials"],
    created: "2022-09-27T04:50:44.000Z",
    manual_sorting: 5,
    card_layout: "bottom",
    image_added_at: new Date()
  },
  {
    slug: "tea_xyz",
    homepage: "https://tea.xyz",
    maintainer: "tea.xyz",
    name: "tea.xyz",
    version: "0.8.6",
    last_modified: "2022-10-19T19:13:51.000Z",
    full_name: "tea.xyz",
    dl_count: 0,
    description: "Manage compile and link flags for libraries",
    short_description: "Manage compile and link flags for libraries",
    keywords: [],
    installs: 0,
    categories: ["top_packages", "foundation_essentials"],
    created: "2022-10-19T19:13:51.000Z",
    manual_sorting: 6,
    card_layout: "bottom",
    image_added_at: new Date()
  },
  {
    slug: "charm_sh_gum",
    homepage: "https://charm.sh",
    maintainer: "charm.sh",
    name: "gum",
    version: "0.8.0",
    last_modified: "2022-10-21T02:15:16.000Z",
    full_name: "charm.sh/gum",
    dl_count: 0,
    description: "Manage compile and link flags for libraries",
    short_description: "Manage compile and link flags for libraries",
    keywords: [],
    installs: 0,
    categories: ["top_packages", "foundation_essentials"],
    created: "2022-10-21T02:15:16.000Z",
    manual_sorting: 7,
    card_layout: "bottom",
    image_added_at: new Date()
  },
  {
    slug: "pyyaml_org",
    homepage: "https://pyyaml.org",
    name: "pyyaml.org",
    version: "0.2.5",
    last_modified: "2022-10-03T15:35:14.000Z",
    full_name: "pyyaml.org",
    dl_count: 107505,
    maintainer: "",
    description: "Manage compile and link flags for libraries",
    short_description: "Manage compile and link flags for libraries",
    keywords: [],
    installs: 0,
    categories: ["top_packages", "foundation_essentials"],
    created: "2022-10-03T15:35:14.000Z",
    manual_sorting: 8,
    card_layout: "bottom",
    image_added_at: new Date()
  },
  {
    slug: "tea_xyz_gx_cc",
    homepage: "https://tea.xyz",
    maintainer: "tea.xyz",
    name: "cc",
    version: "0.1.0",
    last_modified: "2022-10-19T16:47:44.000Z",
    full_name: "tea.xyz/gx/cc",
    dl_count: 0,
    description: "Manage compile and link flags for libraries",
    short_description: "Manage compile and link flags for libraries",
    keywords: [],
    installs: 0,
    categories: ["top_packages", "foundation_essentials"],
    created: "2022-10-19T16:47:44.000Z",
    manual_sorting: 9,
    card_layout: "bottom",
    image_added_at: new Date()
  }
];

export const getInstalledPackages = () => [];
export async function getDistPackages(): Promise<Package[]> {
  return packages;
}

export async function getInstalledVersionsForPackage(full_name: string): Promise<Package> {
  return (packages.find((pkg) => pkg.full_name === full_name) ?? {
    full_name,
    installed_versions: []
  }) as Package;
}

export async function getPackages(): Promise<GUIPackage[]> {
  return packages.map((pkg) => {
    return {
      ...pkg,
      state: PackageStates.AVAILABLE
    };
  });
}

export async function installPackage(pkg: GUIPackage, version?: string) {
  console.log("installing: ", pkg.full_name, version);
  await delay(10000);
}

export async function syncPantry() {
  console.log("syncing pantry");
  await delay(1000);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getTopPackages(): Promise<GUIPackage[]> {
  await delay(500);
  return packages.slice(0, 9).map((pkg) => {
    return {
      ...pkg,
      state: PackageStates.AVAILABLE
    };
  });
}

export async function getAllPosts(type: string): Promise<AirtablePost[]> {
  console.log("filter by type:", type);
  const posts: AirtablePost[] = [
    {
      airtable_record_id: "a",
      link: "https://google.com",
      title: "Tea Inc releases game changing api!",
      sub_title: "lorem ipsum dolor sit amet",
      short_description: "lorem ipsum dolor sit amet",
      thumb_image_url: "/images/bored-ape.png",
      thumb_image_name: "borred-api.png",
      created_at: new Date(),
      updated_at: new Date(),
      published_at: new Date(),
      tags: ["news"]
    },
    {
      airtable_record_id: "b",
      link: "https://google.com",
      title: "Bored Ape not bored anymore",
      sub_title: "lorem ipsum dolor sit amet",
      short_description: "lorem ipsum dolor sit amet",
      thumb_image_url: "/images/bored-ape.png",
      thumb_image_name: "borred-api.png",
      created_at: new Date(),
      updated_at: new Date(),
      published_at: new Date(),
      tags: ["news"]
    },
    {
      airtable_record_id: "c",
      link: "https://google.com",
      title: "Markdown can be executed! hoohah!",
      sub_title: "lorem ipsum dolor sit amet",
      short_description: "lorem ipsum dolor sit amet",
      thumb_image_url: "/images/bored-ape.png",
      thumb_image_name: "borred-api.png",
      created_at: new Date(),
      updated_at: new Date(),
      published_at: new Date(),
      tags: ["news"]
    }
  ];

  return posts;
}

export async function getPackage(packageName: string): Promise<Partial<Package>> {
  return packages.find((pkg) => pkg.full_name === packageName) || packages[0];
}

export const getSession = async (): Promise<Session | null> => {
  return null;
};

export const isDev = async () => true;

export const updateSession = async (session: Partial<Session>) => {
  console.log(session);
};

export const openTerminal = (cmd: string) => console.log(cmd);

export const shellOpenExternal = (link?: string) => {
  window.open(link, "_blank");
};

export const listenToChannel = (channel: string, callback: (msg: string, ...args: any) => void) => {
  console.log("listen to channel", channel, callback);
};

export const relaunch = () => {
  console.log("relaunch");
};

export const getProtocolPath = async (): Promise<string> => "";

export const submitLogs = async (): Promise<string> => {
  return "deviceId---logid";
};

export const isPackageInstalled = async (_v?: string): Promise<boolean> => {
  return true;
};

export const setBadgeCount = async (count: number) => {
  console.log("set badge count", count);
};

export const deletePackage = async (args: { fullName: string; version: string }) => {
  console.log("delete package", args);
};

export const loadPackageCache = async () => {
  return { version: "1", packages: {} };
};

export const writePackageCache = async (pkgs: Packages) => {
  console.log("write package cache", pkgs);
};

export const topbarDoubleClick = async () => {
  console.log("topbar double click");
};

export const cacheImageURL = async (_url: string): Promise<string | undefined> => {
  return undefined;
};

export const getAutoUpdateStatus = async (): Promise<AutoUpdateStatus> => {
  return { status: "up-to-date" };
};

export async function requestSubprocessesSnapshot() {
  //noop
}

export async function openPackageEntrypointInTerminal(_pkg: GUIPackage) {
  //noop
}

export const pollDeviceSession = async () => {
  console.log("do nothing");
};

export const monitorTeaDir = async () => {
  console.log("do nothing");
};

export const stopMonitoringTeaDir = async () => {
  console.log("do nothing");
};

export const getHeaders = async (_path: string) => ({});

export const getPantryDetails = async (fullName: string) => {
  return {
    display_name: "display-name",
    entrypoint: "entrypoint.sh",
    provides: ["bin/1", "bin/2"]
  };
};
