import type { User } from 'payload';

/**
 * Access control callback type used to determine if a user has permission
 * to access the cache purge feature.
 *
 * @param args - Object containing the current authenticated user.
 * @returns A boolean or a promise that resolves to a boolean indicating access permission.
 */
export type AccessCallback = (args: {
  user?: User;
}) => boolean | Promise<boolean>;

export type PurgeCachePluginConfig = {
  /**
   * Enables or disables the plugin. If false, the plugin will not be registered.
   */
  enabled?: boolean;
  /**
   * The route path to expose the plugin UI in the Payload admin panel.
   * Defaults to '/riveo-purge-cache' if not provided.
   */
  path?: string;
  /**
   * The API route path to trigger purges.
   * Defaults to the value of `path` option if not provided.
   */
  apiPath?: string;
  /**
   * Optional access control callback to restrict plugin access in the admin panel.
   */
  access?: AccessCallback;
  /**
   * List of purger objects that will be executed when the purge action is triggered.
   */
  purgers: Record<string, Purger>;
};

export type PurgerResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Function that executes a purge action.
 *
 * @returns A promise resolving to an object that may contain an error.
 */
export type PurgerAction = () => Promise<PurgerResult>;

export type PurgerMeta = {
  /**
   * Human-readable label for the purger (used in UI and logs).
   */
  label: string;

  /**
   * Option to deselect purger on purgers list by default (defaults to true)
   *
   * When this option is false, the purger will require manual interaction to run.
   */
  default?: boolean;
};

/**
 * Represents a single cache purging strategy or destination.
 */
export type Purger = PurgerMeta & {
  /**
   * Function that performs the purge and returns status or error.
   * It has to be a server action.
   */
  action: PurgerAction;
};

export type PurgeCachePluginServerProps = {
  purgeCachePlugin: {
    purgers: Record<string, PurgerMeta>;
    path: `/${string}`;
    apiPath: `/${string}`;
    access?: AccessCallback;
  };
};
