'use client';

import {
  Button,
  FieldError,
  FieldLabel,
  TextInput,
  useField,
  useForm,
  useFormFields,
} from '@payloadcms/ui';
import type { TextFieldClientProps } from 'payload';
import { useCallback, useEffect } from 'react';
import { formatSlug } from '../formatSlug.js';

import './slug.scss';

type SlugFieldProps = {
  autogenerateSourceField?: string;
} & TextFieldClientProps;

const Field = ({
  field,
  autogenerateSourceField,
  path,
  readOnly,
}: SlugFieldProps) => {
  const { label, localized } = field;

  const valueFieldPath = `${path}.value`;
  const autoModeFieldPath = `${path}.auto`;

  const { setValue, value, errorMessage, showError } = useField<string>({
    path: valueFieldPath,
  });

  const { dispatchFields, setModified } = useForm();

  const isAutoMode = useFormFields(([fields]) => {
    return !!autogenerateSourceField && !!fields[autoModeFieldPath]?.value;
  });

  const sourceValue = useFormFields(([fields]) => {
    return autogenerateSourceField
      ? (fields[autogenerateSourceField]?.value as string)
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
          !!autogenerateSourceField && (
            <div className="auto-mode-trigger-wrap">
              <Button
                onClick={onClick}
                buttonStyle="none"
                className="auto-mode-trigger"
              >
                {isAutoMode ? 'edit' : 'autogenerate'}
              </Button>
            </div>
          )
        }
      />
    </div>
  );
};

export default Field;
