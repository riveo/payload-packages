import * as migration_20250619_164819 from './20250619_164819';
import * as migration_20250619_215043 from './20250619_215043';

export const migrations = [
  {
    up: migration_20250619_164819.up,
    down: migration_20250619_164819.down,
    name: '20250619_164819',
  },
  {
    up: migration_20250619_215043.up,
    down: migration_20250619_215043.down,
    name: '20250619_215043'
  },
];
