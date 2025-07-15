import type {Field} from "payload";

export type FieldOptions<T extends Field> = {
  overrides?: Partial<T>;
}
