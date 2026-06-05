import type { TypedUser } from 'payload';
import type { AccessCallback } from './types.js';

type CanAccessPurgeCacheOptions = {
  user: TypedUser | undefined | null;
  access?: AccessCallback;
};

export const canAccessPurgeCache = async ({
  user,
  access = () => true,
}: CanAccessPurgeCacheOptions) => {
  return !!user && (await access({ user }));
};
