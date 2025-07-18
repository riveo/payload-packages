'use client';

import {
  Button,
  FieldError,
  FieldLabel,
  TextInput,
  useField,
  useForm,
  useFormFields,
  useTranslation,
} from '@payloadcms/ui';
import { get, has } from 'lodash-es';
import type { TextFieldClientProps } from 'payload';
import { useCallback, useEffect } from 'react';
import type {
  RiveoUtilsTranslationKeys,
  RiveoUtilsTranslations,
} from '../../../translations/index.js';
import { formatSlug } from '../formatSlug.js';

import './slug.scss';

type SlugFieldProps = {
  generateFrom?: string;
} & TextFieldClientProps;

const FieldClient = ({
  field,
  generateFrom,
  path,
  readOnly,
}: SlugFieldProps) => {
  const { label, localized } = field;
  const { t } = useTranslation<
    RiveoUtilsTranslations,
    RiveoUtilsTranslationKeys
  >();

  const valueFieldPath = `${path}.value`;
  const autoModeFieldPath = `${path}.auto`;

  const { setValue, value, errorMessage, showError } = useField<string>({
    path: valueFieldPath,
  });

  const { dispatchFields, setModified } = useForm();

  const isAutoMode = useFormFields(([fields]) => {
    return !!generateFrom && !!fields[autoModeFieldPath]?.value;
  });

  const sourceValue = useFormFields(([fields]) => {
    return generateFrom && has(fields, generateFrom)
      ? get(fields, generateFrom)?.value?.toString()
      : undefined;
  });

  useEffect(() => {
    if (isAutoMode) {
      const formattedSlug = sourceValue ? formatSlug(sourceValue) : '';

      if (value !== formattedSlug) {
        setValue(formattedSlug);
      }
    }
  }, [sourceValue, isAutoMode, setValue, value]);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      dispatchFields({
        type: 'UPDATE',
        path: autoModeFieldPath,
        value: !isAutoMode,
      });

      setModified(true);
    },
    [dispatchFields, autoModeFieldPath, isAutoMode, setModified],
  );

  return (
    <div className="field-type slug-group">
      <div className="label-wrapper">
        <FieldLabel
          htmlFor={`field-${path}`}
          label={label}
          required
          localized={localized}
        />
      </div>

      <TextInput
        path={valueFieldPath}
        onChange={setValue}
        readOnly={!!readOnly || isAutoMode}
        value={value}
        Error={
          errorMessage && (
            <FieldError
              path={valueFieldPath}
              showError
              message={errorMessage}
            />
          )
        }
        showError={showError}
        AfterInput={
          !!generateFrom && (
            <div className="auto-mode-trigger-wrap">
              <Button
                onClick={onClick}
                buttonStyle="none"
                className="auto-mode-trigger"
              >
                {isAutoMode
                  ? t('riveo:utils:fields:slug:autogenerateToggle:edit')
                  : t(
                      'riveo:utils:fields:slug:autogenerateToggle:autogenerate',
                    )}
              </Button>
            </div>
          )
        }
      />
    </div>
  );
};

export default FieldClient;
