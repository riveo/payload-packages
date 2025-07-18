import {
  type S3StorageOptions,
  s3Storage as s3StorageBase,
} from '@payloadcms/storage-s3';
import type { Config, Plugin, UploadCollectionSlug } from 'payload';

type CollectionOptions = Exclude<
  S3StorageOptions['collections'][UploadCollectionSlug],
  true
>;

type S3PluginConfig = {
  enabled?: boolean;
  collections: UploadCollectionSlug[];

  disablePublicAccess: boolean;

  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;

  region?: string;
  endpoint?: string;
  publicEndpoint?: string;

  overrides?: Partial<S3StorageOptions>;
};

const s3Storage = (pluginConfig: S3PluginConfig): Plugin => {
  return (incomingConfig: Config) => {
    if (pluginConfig?.enabled === false) {
      // hack to fix migrations removing `prefix` field when S3 storage is disabled
      return {
        ...incomingConfig,
        collections: incomingConfig.collections?.map((collection) => {
          if (!pluginConfig.collections.includes(collection.slug)) {
            return collection;
          }

          collection.fields.push({
            name: 'prefix',
            required: false,
            type: 'text',
            defaultValue: collection.slug + '/',
          });

          return collection;
        }),
      };
    }

    const collections = pluginConfig?.collections ?? [];

    if (collections.length === 0) {
      return incomingConfig;
    }

    const hasPublicAccess = pluginConfig?.disablePublicAccess !== true;

    return s3StorageBase({
      disableLocalStorage: true,
      bucket: pluginConfig.bucket,
      acl: hasPublicAccess ? 'public-read' : 'private',
      ...(pluginConfig.overrides ?? {}),

      collections: Object.fromEntries(
        collections.map((collection) => {
          const collectionOverrides =
            pluginConfig.overrides?.collections?.[collection];

          const options: CollectionOptions = {
            disableLocalStorage: true,
            disablePayloadAccessControl: hasPublicAccess || undefined,
            prefix: collection,
            generateFileURL:
              hasPublicAccess && pluginConfig?.publicEndpoint
                ? (args) => {
                    return `${pluginConfig.publicEndpoint}/${args.prefix}/${args.filename}`;
                  }
                : undefined,
            ...(collectionOverrides && collectionOverrides !== true
              ? collectionOverrides
              : {}),
          };

          return [collection, options];
        }),
      ),

      config: {
        region: pluginConfig.region ?? '',
        forcePathStyle: true,
        credentials: {
          accessKeyId: pluginConfig.accessKeyId,
          secretAccessKey: pluginConfig.secretAccessKey,
          ...(pluginConfig?.overrides?.config?.credentials ?? {}),
        },
        endpoint: pluginConfig.endpoint,
        ...(pluginConfig?.overrides?.config ?? {}),
      },
    })(incomingConfig);
  };
};

export default s3Storage;
