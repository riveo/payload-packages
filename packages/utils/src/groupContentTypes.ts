import type { CollectionConfig, GlobalConfig } from 'payload';

type Collection = CollectionConfig | GlobalConfig;

type Group<T extends Collection> =
  | {
      items: T[];
      group?: NonNullable<T['admin']>['group'];
    }
  | T;

type Config<T extends Collection> = (T extends CollectionConfig
  ? Group<CollectionConfig>
  : Group<GlobalConfig>)[];

/**
 * Groups collections or globals using its config's `group` field.
 * Example usage: `groupContentTypes<CollectionConfig>(UngroupedCollection, { group: 'Content', items: [Collection1, Collection2] })`
 */
const groupContentTypes = <T extends Collection>(...items: Config<T>): T[] => {
  return items
    .map((config) => {
      const { group, items } =
        'slug' in config ? { group: undefined, items: [config] } : config;

      return items.map((itemConfig) => ({
        ...itemConfig,
        admin: {
          ...(itemConfig.admin ?? {}),
          group,
        },
      }));
    })
    .flat() as T[];
};

export default groupContentTypes;
