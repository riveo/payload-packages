import type { FieldHook } from 'payload';
import slugify from 'slugify';

const canUseValue = (value: unknown): value is string | null | undefined => {
  return (
    value === null || typeof value === 'string' || typeof value === 'undefined'
  );
};

export const formatSlug = (value: string) =>
  slugify.default(value.replace(/\/+/g, ' '), {
    lower: true,
    trim: true,
  });

export const formatSlugHook =
  (autogenerateSourceField: string | undefined): FieldHook =>
  ({ data, value }) => {
    if (canUseValue(value)) {
      return formatSlug(value ?? '');
    }

    if (
      autogenerateSourceField &&
      !value &&
      data &&
      autogenerateSourceField in data
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const slugSourceData = data[autogenerateSourceField];

      if (slugSourceData && typeof slugSourceData === 'string') {
        return formatSlug(slugSourceData);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  };
