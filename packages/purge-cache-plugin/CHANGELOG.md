# Changelog

## [Unreleased]

Nothing here.

## 0.2.0

A rework of the plugin's architecture and API.

### Added

- A dedicated API endpoint for triggering cache purges from the admin UI.
- Consistent access enforcement across the admin menu entry, purge page, and purge API endpoint.
- Generic global error handling in the admin UI for request-level failures.

### Changed

- Selected purgers now run concurrently instead of sequentially.
- Per-purger results are now returned in a keyed result object for clearer status reporting.
- The admin UI now presents per-purger results more clearly during and after a purge run.
- The plugin configuration now uses a keyed `Record<string, Purger>` instead of an array.
- Custom purgers now use `run` instead of `action`.
- Built-in helper names changed:
  - `getCloudflarePurgerAction` -> `createCloudflarePurger`
  - `getHttpPurgerAction` -> `createHttpPurger`
  - `getNextjsPurgerAction` -> `createNextJsPathPurger`
- The public runner type changed from `PurgerAction` to `PurgerRunner`.
- The access callback shape is now consistently `({ user }) => boolean | Promise<boolean>`.

### Removed

- The old Next.js-action-oriented purge flow.

### Why

- Running selected purgers concurrently reduces waiting time when several independent caches need to be invalidated.
- Keyed purgers give the UI and API stable IDs, which clarifies result reporting and configuration.
- `run` is a better fit than `action` because purgers are now modeled as reusable runners rather than Next.js-style actions.
- Enforcing access in the API as well as the UI closes the gap between what users can see and what they are actually allowed to trigger.
- Moving to a dedicated API endpoint gives the plugin a cleaner integration boundary and makes the purge mechanism easier to reuse from other server-side entry points.
