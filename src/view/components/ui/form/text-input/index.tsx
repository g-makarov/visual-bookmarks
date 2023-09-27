import clsx from 'clsx';
import * as React from 'react';
import { useMemo } from 'react';

export type InputSize = 'medium' | 'large';

export interface TextInputProps
  extends Omit<React.AllHTMLAttributes<HTMLInputElement>, 'autoComplete' | 'size'> {
  error?: boolean;
  autoComplete?: boolean | string;
  size?: InputSize;
  inputClassName?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      className,
      inputClassName,
      placeholder,
      autoComplete,
      error = false,
      size = 'medium',
      type = 'text',
      ...inputProps
    },
    ref,
  ) => {
    const autoCompleteAttribute = useMemo(() => {
      if (typeof autoComplete === 'boolean') {
        return autoComplete ? undefined : 'off';
      }
      return autoComplete;
    }, [autoComplete]);

    return (
      <div className={clsx('relative', className)}>
        <input
          ref={ref}
          className={clsx(inputClassName, 'form__input', `form__input--size-${size}`, {
            'form__input--error': Boolean(error),
          })}
          placeholder={placeholder}
          autoComplete={autoCompleteAttribute}
          type={type}
          {...inputProps}
        />
      </div>
    );
  },
);
