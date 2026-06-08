# Payload Purge Cache plugin

A plugin for [PayloadCMS](https://payloadcms.com/) that adds a dedicated cache purge page to the Payload admin and runs selected purgers concurrently.

## Features

- Run selected purgers from the Payload admin UI
- Execute all selected purgers concurrently and collect per-purger results
- Restrict access with a single access callback shared by UI and API
- Use built-in purgers for Cloudflare, Next.js path revalidation, and generic HTTP endpoints
- Define your own purgers with a simple `run()` contract

## Installation

```sh
npm install @riveo/payload-purge-cache-plugin
```

## Basic usage

```ts
import { buildConfig } from 'payload';
import purgeCachePlugin, {
  createNextJsPathPurger,
} from '@riveo/payload-purge-cache-plugin';

export default buildConfig({
  plugins: [
    purgeCachePlugin({
      purgers: {
        nextjs: {
          label: 'Next.js',
          run: createNextJsPathPurger('/'),
        },
      },
    }),
  ],
});
```

## Configuration

The plugin accepts the following options:

- `enabled?: boolean`
  Defaults to `true`.
- `path?: string`
  Admin page path. Defaults to `/riveo-purge-cache`.
- `apiPath?: string`
  API endpoint path used by the admin UI. Defaults to `path`.
- `access?: ({ user }) => boolean | Promise<boolean>`
  Shared access callback used by the menu entry, admin page, and API handler.
- `purgers: Record<string, Purger>`
  Keyed purger definitions. The key is the stable ID sent to the API and used in the UI response map.

Example:

```ts
import purgeCachePlugin, {
  createCloudflarePurger,
  createHttpPurger,
  createNextJsPathPurger,
} from '@riveo/payload-purge-cache-plugin';

purgeCachePlugin({
  path: '/cache/purge',
  apiPath: '/api/cache/purge',
  access: ({ user }) => user?.role === 'admin',
  purgers: {
    nextjs: {
      label: 'Next.js',
      run: createNextJsPathPurger('/'),
    },
    cloudflare: {
      label: 'Cloudflare',
      run: createCloudflarePurger({
        apiKey: process.env.CLOUDFLARE_API_KEY ?? '',
        zoneId: process.env.CLOUDFLARE_ZONE_ID ?? '',
      }),
    },
    frontendWebhook: {
      label: 'Frontend webhook',
      default: false,
      run: createHttpPurger(process.env.FRONTEND_PURGE_URL ?? '', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.FRONTEND_PURGE_TOKEN ?? ''}`,
        },
      }),
    },
  },
});
```

## Purger shape

A purger is a keyed object with display metadata and a runner:

```ts
type Purger = {
  label: string;
  default?: boolean;
  run: () => Promise<{ success: true } | { success: false; error: string }>;
};
```

This makes purgers reusable outside the admin page as well, for example from hooks or custom server code.

## Built-in purgers

### `createCloudflarePurger(options)`

Purges Cloudflare cache for a specific zone.

Parameters:

- `apiKey: string`
- `zoneId: string`
- `hosts?: string[]`
- `tags?: string[]`
- `prefixes?: string[]`
- `files?: string[]`

If `hosts`, `tags`, `prefixes`, and `files` are all omitted, the purger sends `purge_everything: true`.

### `createNextJsPathPurger(basePath = '/')`

Triggers Next.js cache revalidation through `revalidatePath(basePath, 'layout')`.

Parameters:

- `basePath?: string`

### `createHttpPurger(endpoint, options?)`

Calls a generic HTTP endpoint with `fetch`.

Parameters:

- `endpoint: RequestInfo`
- `options?: RequestInit`

## Admin behavior

- The plugin adds a `Purge Cache` entry to the admin settings menu.
- The page shows all configured purgers with checkboxes.
- Selected purgers run concurrently.
- Each purger gets its own success/error status.
- The UI shows a generic global error for request-level failures such as `403`.

## Custom purgers

You can define your own purger without using the built-in helpers:

```ts
const purgeSearchIndex = {
  label: 'Search index',
  run: async () => {
    const res = await fetch('https://example.com/api/reindex', {
      method: 'POST',
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Reindex failed: ${res.status}`,
      };
    }

    return { success: true };
  },
};
```

## License

This project is licensed under the [MIT License](./LICENSE.md).
