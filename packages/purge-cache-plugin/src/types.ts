import type { TypedUser } from 'payload';

/** Access callback shared by the admin UI and purge API. */
export type AccessCallback = (args: {
  user?: TypedUser;
}) => boolean | Promise<boolean>;

export type PurgeCachePluginConfig = {
  /** Disable plugin registration. */
  enabled?: boolean;
  /** Admin page path. Defaults to `/riveo-purge-cache`. */
  path?: string;
  /** API endpoint path. Defaults to `path`. */
  apiPath?: string;
  /** Optional access control for the purge UI and API. */
  access?: AccessCallback;
  /** Purgers keyed by stable ID. */
  purgers: Record<string, Purger>;
};

export type PurgerResult =
  | { success: true }
  | { success: false; error: string };

export type PurgerRunner = () => Promise<PurgerResult>;

export type PurgerMeta = {
  /** Label shown in the admin UI. */
  label: string;
  /** Exclude from default selection when set to `false`. */
  default?: boolean;
};

export type Purger = PurgerMeta & {
  /** Function that runs one purge target and returns its result. */
  run: PurgerRunner;
};

export type PurgeCachePluginServerProps = {
  purgeCachePlugin: {
    purgers: Record<string, PurgerMeta>;
    path: `/${string}`;
    apiPath: `/${string}`;
    access?: AccessCallback;
  };
};
