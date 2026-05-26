import type { AdminViewServerProps } from 'payload';
import type { PurgeCachePluginServerProps } from '../types.js';
import NavLink from './NavLink.js';

type ToolsMenuProps = AdminViewServerProps & PurgeCachePluginServerProps;

const ToolsMenu = async ({
  purgeCachePlugin,
  payload,
  user,
}: ToolsMenuProps) => {
  if (!user) {
    return null;
  }

  if (purgeCachePlugin.access && !(await purgeCachePlugin.access({ user }))) {
    return null;
  }

  const href = `${payload.getAdminURL()}${purgeCachePlugin.path}`;

  return <NavLink href={href} />;
};

export default ToolsMenu;
