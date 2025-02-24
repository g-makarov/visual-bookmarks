import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';
import React, { useId } from 'react';

import styles from './styles.module.scss';

export interface CheckboxProps extends React.AllHTMLAttributes<HTMLInputElement> {
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...inputProps }, ref) => {
    const id = useId();
    const checkboxId = `checkbox-${id}`;

    return (
      <label className={clsx(styles['container'], className)} htmlFor={checkboxId}>
        <input
          id={checkboxId}
          type="checkbox"
          className={styles['input']}
          ref={ref}
          {...inputProps}
        />
        <div className={styles['square']}>
          <CheckIcon className={styles['square__icon']} size={16} />
        </div>
        {label && <p className={styles['label']}>{label}</p>}
      </label>
    );
  },
);
