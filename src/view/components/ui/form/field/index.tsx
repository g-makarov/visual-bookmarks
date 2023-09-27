import clsx from 'clsx';
import React, { ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

import { FieldErrorMessage } from '~/view/components/ui/form/field-error-message';

export interface FieldProps {
  label?: string;
  error?: FieldError;
  className?: string;
  children: ReactNode;
  labelClassName?: string;
  childrenClassName?: string;
  required?: boolean;
}

export const Field: React.FC<FieldProps> = ({
  label,
  error,
  className,
  required,
  children,
  labelClassName,
  childrenClassName,
}) => {
  return (
    <div className={clsx('form__field', 'form__field-row', className)}>
      {label && (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label className={clsx('form__label', labelClassName)} title={label}>
          {label}
          {required ? ' *' : null}
        </label>
      )}
      <div className={childrenClassName}>{children}</div>
      <FieldErrorMessage error={error} />
    </div>
  );
};
