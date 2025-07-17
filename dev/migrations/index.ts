import * as migration_20250619_164819 from './20250619_164819';
import * as migration_20250619_215043 from './20250619_215043';
import * as migration_20250715_134418 from './20250715_134418';
import * as migration_20250716_205036 from './20250716_205036';

export const migrations = [
  {
    up: migration_20250619_164819.up,
    down: migration_20250619_164819.down,
    name: '20250619_164819',
  },
  {
    up: migration_20250619_215043.up,
    down: migration_20250619_215043.down,
    name: '20250619_215043',
  },
  {
    up: migration_20250715_134418.up,
    down: migration_20250715_134418.down,
    name: '20250715_134418',
  },
  {
    up: migration_20250716_205036.up,
    down: migration_20250716_205036.down,
    name: '20250716_205036',
  },
];
