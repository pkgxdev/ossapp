import type { ComponentType } from "svelte";
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
  last_modified: Date | string;
  created: Date | string;
  thumb_image_url: string;
  thumb_image_name: string;
  desc: string;
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
    type: "md" | "rst";
  };
  manual_sorting: number;
  card_layout: "bottom" | "right" | "left";
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

export type Tab = {
  label: string;
  props?: {
    [key: string]:
      | string
      | Date
      | number
      | Record<string, unknown>
      | Array<string>
      | Array<number>
      | Array<Date>
      | Array<Record<string, unknown>>
      | Package;
  };
  component: ComponentType;
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
  i18n_key: string;
  message: string;
  type: NotificationType;
  callback_label?: string;
  callback?: () => void;
  params?: { [key: string]: string };
}
