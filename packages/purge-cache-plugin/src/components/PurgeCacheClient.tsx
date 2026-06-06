'use client';

import {
  MoreIcon,
  LineIcon,
  ErrorIcon,
  SuccessIcon,
  Button,
  CheckboxInput,
  useConfig,
} from '@payloadcms/ui';
import { useState, useTransition } from 'react';
import type {
  PurgeCacheRequestData,
  PurgeCacheResponse,
} from '../api/purge-api-handler.js';
import type { PurgerMeta, PurgerResult } from '../types.js';

type PurgeCacheButtonProps = {
  purgers: Record<string, PurgerMeta>;
  apiPath: `/${string}`;
};

const PurgerStatus = ({
  isLoading,
  result,
}: {
  isLoading?: boolean;
  result?: PurgerResult;
}) => {
  if (isLoading) {
    return <MoreIcon />;
  }

  if (!result) {
    return <LineIcon />;
  }

  if (!result.success) {
    return <ErrorIcon />;
  }

  return <SuccessIcon />;
};

const PurgeCacheClient = ({ purgers, apiPath }: PurgeCacheButtonProps) => {
  const [isLoading, startTransition] = useTransition();
  const [results, setResults] = useState<Record<string, PurgerResult>>({});
  const [error, setError] = useState<string>();

  const {
    config: {
      routes: { api: apiRoute },
    },
  } = useConfig();

  const [selectedPurgers, setSelectedPurgers] = useState<
    Record<string, boolean>
  >(
    Object.fromEntries(
      Object.entries(purgers).map(([key, value]) => {
        return [key, value.default !== false];
      }),
    ),
  );

  const togglePurger = (id: string) => {
    setSelectedPurgers((previous) => {
      return {
        ...previous,
        [id]: !previous[id],
      };
    });
  };

  const purgeCache = () => {
    startTransition(async () => {
      const purgersToExecute = [];
      for (const purger of Object.keys(selectedPurgers)) {
        if (selectedPurgers[purger]) {
          purgersToExecute.push(purger);
        }
      }

      setError(undefined);
      setResults({});

      const res = await fetch(`${apiRoute}${apiPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purge: purgersToExecute,
        } satisfies PurgeCacheRequestData),
      });

      if (res.ok) {
        const data = (await res.json()) as PurgeCacheResponse;

        setResults(data.results);
        return;
      }

      switch (res.status) {
        case 403:
          setError('You do not have permission to purge cache.');
          break;
        default:
          setError('Could not purge cache.');
      }
    });
  };

  return (
    <div className="riveo-purge-cache-plugin-container">
      <div className="riveo-purge-cache-plugin-container__purgers">
        <ul>
          {Object.entries(purgers).map(([key, { label }]) => (
            <li key={key}>
              <div>
                <CheckboxInput
                  onToggle={() => togglePurger(key)}
                  checked={selectedPurgers[key]}
                  label={label}
                  id={`riveo-cache-purger-${key}`}
                />

                <div className="purger-status-container">
                  <PurgerStatus
                    isLoading={selectedPurgers[key] && isLoading}
                    result={results?.[key]}
                  />
                </div>
              </div>
              {results[key]?.success === false && (
                <pre className="purger-error">
                  {results[key]?.error ?? 'Unknown error'}
                </pre>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="riveo-purge-cache-plugin-container__button-row">
        <Button onClick={() => purgeCache()} disabled={isLoading}>
          Purge selected caches
        </Button>
      </div>
      {error && <pre className="purger-error">{error}</pre>}
    </div>
  );
};

export default PurgeCacheClient;
