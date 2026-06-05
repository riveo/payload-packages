import { DefaultTemplate } from '@payloadcms/next/templates';
import { Gutter, RenderTitle } from '@payloadcms/ui';
import { notFound, redirect } from 'next/navigation.js';
import type { AdminViewServerProps } from 'payload';
import type { PurgeCachePluginServerProps } from '../types.js';
import './styles.scss';
import PurgeCacheClient from './PurgeCacheClient.js';
import { canAccessPurgeCache } from '../access.js';

type CloudflareProps = AdminViewServerProps & PurgeCachePluginServerProps;

const PurgeCache = async ({
  initPageResult,
  purgeCachePlugin,
  payload,
  params,
  searchParams,
}: CloudflareProps) => {
  if (
    !(await canAccessPurgeCache({
      user: initPageResult?.req?.user,
      access: purgeCachePlugin.access,
    }))
  ) {
    return redirect(
      `${payload.getAdminURL()}/login?redirect=${payload.getAdminURL()}${purgeCachePlugin?.path}`,
    );
  }

  if (!initPageResult.permissions.canAccessAdmin) {
    return notFound();
  }

  return (
    <DefaultTemplate
      i18n={initPageResult?.req.i18n}
      locale={initPageResult?.locale}
      params={params}
      payload={initPageResult?.req.payload}
      permissions={initPageResult?.permissions}
      searchParams={searchParams}
      user={initPageResult?.req.user ?? undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <RenderTitle title="Purge Cache" />
        <PurgeCacheClient
          purgers={purgeCachePlugin.purgers}
          apiPath={purgeCachePlugin.apiPath}
        />
      </Gutter>
    </DefaultTemplate>
  );
};

export default PurgeCache;
