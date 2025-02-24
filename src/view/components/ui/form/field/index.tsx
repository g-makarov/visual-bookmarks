import clsx from 'clsx';
import React, { type ReactNode } from 'react';
import { type FieldError } from 'react-hook-form';

import { FieldErrorMessage } from '~/view/components/ui/form/field-error-message';

export interface FieldProps {
  label?: string;
  error?: FieldError;
  className?: string;
  children: ReactNode;
  labelClassName?: string;
  childrenClassName?: string;
  optional?: boolean;
}

export const Field: React.FC<FieldProps> = ({
  label,
  error,
  className,
  optional,
  children,
  labelClassName,
  childrenClassName,
}) => {
  return (
    <div className={clsx('form__field', 'form__field-row', className)}>
      {label && (
        <label className={clsx('form__label', labelClassName)} title={label}>
          {label}
          {optional ? ' (optional)' : null}
        </label>
      )}
      <div className={childrenClassName}>{children}</div>
      <FieldErrorMessage error={error} />
    </div>
  );
};
