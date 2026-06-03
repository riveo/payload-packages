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
import type { PurgeCacheRequestData } from '../api-handler.js';
import type { Purger, PurgerResult } from '../types.js';

type PurgeCacheButtonProps = {
  purgers: Record<string, Pick<Purger, 'label' | 'default'>>;
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

      const res = await fetch(`${apiRoute}${apiPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purge: purgersToExecute,
        } satisfies PurgeCacheRequestData),
      });

      setResults((await res.json()) as Record<string, PurgerResult>);
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
    </div>
  );
};

export default PurgeCacheClient;
