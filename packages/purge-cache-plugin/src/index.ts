import purgeCachePlugin from './plugin.js';

export default purgeCachePlugin;

export {
  type PurgeCachePluginConfig,
  type Purger,
  type PurgerAction,
} from './types.js';

export { getCloudflarePurgerAction } from './purgers/cloudflare.js';
export { getNextjsPurgerAction } from './purgers/nextjs.js';
export { getHttpPurgerAction } from './purgers/http.js';
