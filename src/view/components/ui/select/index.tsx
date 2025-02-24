import './styles.scss';

import clsx from 'clsx';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
import ReactSelect, {
  ActionMeta,
  GroupBase,
  OnChangeValue,
  SelectComponentsConfig,
} from 'react-select';
import CreatableReactSelect from 'react-select/creatable';

import { InputSize } from '~/view/components/ui/form/text-input';

import { isMultiOption, isNewSelectOption } from './utils';

export interface SelectOption<T> {
  label: string;
  value: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface NewSelectOption {
  label: string;
  value: string;
  __isNew__: true;
}

export type SelectValueType<
  TValue,
  TIsMulti extends boolean,
  TIsClearable extends boolean,
  TIsCreatable extends boolean,
> = TIsCreatable extends true
  ? TIsMulti extends true
    ? TValue extends unknown[]
      ? Extract<TValue[number], NewSelectOption> extends never
        ? never
        : TValue
      : never
    : Extract<TValue, NewSelectOption> extends never
    ? never
    : TIsClearable extends true
    ? Extract<TValue, null> extends never
      ? never
      : TValue
    : TValue
  : TIsMulti extends true
  ? TValue extends unknown[]
    ? TValue
    : never
  : TIsClearable extends true
  ? Extract<TValue, null> extends never
    ? never
    : TValue
  : TValue;

export type SelectOnChange<
  TValue,
  TIsMulti extends boolean,
  TIsClearable extends boolean,
  TIsCreatable extends boolean,
> = (value: SelectValueType<TValue, TIsMulti, TIsClearable, TIsCreatable>) => void;

export type SelectOptionType<TValue> = SelectOption<
  TValue extends unknown[] ? TValue[number] : TValue
>;

export interface SelectProps<
  TValue,
  TIsMulti extends boolean,
  TIsClearable extends boolean,
  TIsCreatable extends boolean,
> {
  value: SelectValueType<TValue, TIsMulti, TIsClearable, TIsCreatable>;
  inputSize?: InputSize;
  options: SelectOptionType<TValue>[];
  isMulti?: TIsMulti;
  onChange?: SelectOnChange<TValue, TIsMulti, TIsClearable, TIsCreatable>;
  placeholder?: string;
  className?: string;
  isClearable?: TIsClearable;
  hasError?: boolean;
  disabled?: boolean;
  isCreatable?: TIsCreatable;
  components?: SelectComponentsConfig<
    SelectOptionType<TValue>,
    TIsMulti,
    GroupBase<SelectOptionType<TValue>>
  >;
}

export const Select = <
  TValue,
  TIsMulti extends boolean = false,
  TIsClearable extends boolean = false,
  TIsCreatable extends boolean = false,
>({
  placeholder,
  inputSize = 'medium',
  value,
  options,
  className,
  isMulti = false as TIsMulti,
  onChange,
  isClearable = false as TIsClearable,
  hasError,
  disabled,
  isCreatable,
  components,
}: SelectProps<TValue, TIsMulti, TIsClearable, TIsCreatable>): React.ReactElement => {
  const selectedOption = useMemo(() => {
    if (isCreatable && isNewSelectOption(value)) {
      return value as SelectOptionType<TValue>;
    }

    if (isMulti && Array.isArray(value)) {
      const filteredOptions = options.filter(option => value.includes(option.value));
      if (isCreatable) {
        const newSelectOptions = value.filter(
          isNewSelectOption,
        ) as unknown as SelectOptionType<TValue>[];
        if (newSelectOptions.length > 0) {
          return [...filteredOptions, ...newSelectOptions];
        }
      }
      return filteredOptions;
    }
    return options.find(option => option.value === value) || null;
  }, [isCreatable, isMulti, options, value]);

  const handleChange = useCallback(
    (
      option: OnChangeValue<SelectOptionType<TValue>, TIsMulti>,
      { action }: ActionMeta<SelectOptionType<TValue>>,
    ) => {
      if (!onChange) return;

      if (action === 'clear' && !isMulti) {
        onChange(null as SelectValueType<TValue, TIsMulti, TIsClearable, TIsCreatable>);
        return;
      }

      if (isMultiOption(option)) {
        onChange(
          option.map(value => (isNewSelectOption(value) ? value : value.value)) as SelectValueType<
            TValue,
            TIsMulti,
            TIsClearable,
            TIsCreatable
          >,
        );
      } else if (option) {
        if (isNewSelectOption(option)) {
          onChange(option as SelectValueType<TValue, TIsMulti, TIsClearable, TIsCreatable>);
        } else {
          onChange(option.value as SelectValueType<TValue, TIsMulti, TIsClearable, TIsCreatable>);
        }
      }
    },
    [isMulti, onChange],
  );

  const reactSelectProps = {
    className: clsx('react-select', className, {
      [`react-select--size-${inputSize}`]: inputSize,
      [`react-select--error`]: hasError,
    }),
    isMulti,
    value: selectedOption,
    placeholder,
    options,
    classNamePrefix: 'react-select',
    menuPortalTarget: document.body,
    onChange: handleChange,
    maxMenuHeight: 300,
    menuPlacement: 'auto',
    menuPosition: 'fixed',
    unstyled: true,
    isClearable,
    isDisabled: disabled,
    components,
    closeMenuOnSelect: !isMulti,
  } as const;

  if (isCreatable) {
    return <CreatableReactSelect {...reactSelectProps} />;
  }

  return <ReactSelect {...reactSelectProps} />;
};
