'use client';

import {
  MoreIcon,
  LineIcon,
  ErrorIcon,
  SuccessIcon,
  Button,
  CheckboxInput,
} from '@payloadcms/ui';
import { useState, useTransition } from 'react';
import type { Purger } from '../types.js';

type PurgeCacheButtonProps = {
  purgers: Purger[];
};

const PurgerStatus = ({
  isLoading,
  result,
}: {
  isLoading?: boolean;
  result?: { error?: string };
}) => {
  if (isLoading) {
    return <MoreIcon />;
  }

  if (!result) {
    return <LineIcon />;
  }

  if (result?.error) {
    return <ErrorIcon />;
  }

  return <SuccessIcon />;
};

const PurgeCacheClient = ({ purgers }: PurgeCacheButtonProps) => {
  const [isLoading, startTransition] = useTransition();
  const [results, setResults] = useState<({ error?: string } | undefined)[]>(
    [],
  );

  const [selectedPurgersIds, setSelectedPurgersIds] = useState(
    purgers.map((purger) => purger.default !== false),
  );

  const togglePurger = (id: number) => {
    setSelectedPurgersIds((previous) => {
      return {
        ...previous,
        [id]: !previous?.[id],
      };
    });
  };

  const purgeCache = () => {
    startTransition(async () => {
      const results = await Promise.all(
        purgers.map((purger, i) => {
          if (selectedPurgersIds[i]) {
            return purger.action();
          }

          return Promise.resolve(undefined);
        }),
      );

      setResults(results);
    });
  };

  return (
    <div className="riveo-purge-cache-plugin-container">
      <div className="riveo-purge-cache-plugin-container__purgers">
        <ul>
          {purgers.map(({ label }, i) => (
            <li key={i}>
              <div>
                <CheckboxInput
                  onToggle={() => togglePurger(i)}
                  checked={selectedPurgersIds[i]}
                  label={label}
                  id={`riveo-cache-purger-${i}`}
                />

                <div className="purger-status-container">
                  <PurgerStatus
                    isLoading={selectedPurgersIds[i] && isLoading}
                    result={results?.[i]}
                  />
                </div>
              </div>
              {results?.[i]?.error && (
                <pre className="purger-error">
                  {JSON.stringify(results[i].error)}
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
