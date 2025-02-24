import { MultiValue, SingleValue } from 'react-select';

import { isPlainObject } from '~/utils/isPlainObject';

import { NewSelectOption } from '.';

export function isMultiOption<TOption>(
  option: MultiValue<TOption> | SingleValue<TOption>,
): option is MultiValue<TOption> {
  return Array.isArray(option);
}

export function isNewSelectOption(arg: unknown): arg is NewSelectOption {
  return isPlainObject(arg) && '__isNew__' in arg;
}
