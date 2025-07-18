import type { Field } from 'payload';

export type FieldOptions<T extends Field> = {
  /**
   * Overrides for the field configuration
   */
  overrides?: Partial<T>;
};
