import type { AdminViewServerProps } from 'payload';
import type { PurgeCachePluginServerProps } from '../types.js';
import NavLink from './NavLink.js';
import { canAccessPurgeCache } from '../access.js';

type ToolsMenuProps = AdminViewServerProps & PurgeCachePluginServerProps;

const ToolsMenu = async ({
  purgeCachePlugin,
  payload,
  user,
}: ToolsMenuProps) => {
  if (!(await canAccessPurgeCache({ user, access: purgeCachePlugin.access }))) {
    return null;
  }

  const href = `${payload.getAdminURL()}${purgeCachePlugin.path}`;

  return <NavLink href={href} />;
};

export default ToolsMenu;
