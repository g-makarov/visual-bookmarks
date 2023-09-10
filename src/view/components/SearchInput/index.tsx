import clsx from 'clsx';
import React, { ChangeEvent, FC } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { InputSize, TextInput } from '~/view/components/form/TextInput';
import { Icon } from '~/view/components/Icon';

import styles from './styles.module.scss';

export interface SearchInputProps {
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  defaultValue?: string;
  debounceDelay?: number;
  inputSize?: InputSize;
}

export const SearchInput: FC<SearchInputProps> = ({
  onChange,
  className,
  placeholder,
  inputClassName,
  defaultValue,
  inputSize,
  debounceDelay = 500,
}) => {
  const handleChange = useDebouncedCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    onChange(target.value);
  }, debounceDelay);

  return (
    <div className={clsx(styles['search-input'], className)}>
      <TextInput
        onChange={handleChange}
        placeholder={placeholder}
        inputClassName={clsx(styles['search-input__input'], inputClassName)}
        defaultValue={defaultValue}
        size={inputSize}
      />
      <Icon name="magnifier" className={styles['search-input__icon']} />
    </div>
  );
};
