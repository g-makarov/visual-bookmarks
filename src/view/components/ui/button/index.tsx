import clsx from 'clsx';
import React from 'react';

import { isNil } from '~/utils/isNil';
import { Loader } from '~/view/components/ui/loader';
import { Icon } from '~/view/components/ui/icon';

import styles from './styles.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'negative';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  variant?: ButtonVariant;
  label?: string;
  isLoading?: boolean;
  className?: string;
  size?: ButtonSize;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  withIcon?: string;
  iconClassName?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  iconAfter?: boolean;
  rounded?: boolean;
  bold?: boolean;
  count?: number;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  type = 'button',
  label,
  size = 'medium',
  className,
  onClick,
  withIcon,
  iconClassName,
  variant,
  fullWidth = true,
  children,
  disabled,
  isLoading,
  count,
  rounded = false,
  iconAfter = false,
  bold = false,
}) => {
  const combinedClassName = React.useMemo(() => {
    return clsx(
      styles['button'],
      variant ? styles[`button--${variant}`] : undefined,
      styles[`button--size-${size}`],
      {
        [styles['button--full']]: fullWidth,
        [styles['button--rounded']]: rounded,
        [styles['button--bold']]: bold,
        [styles['button--disabled']]: disabled,
        [styles['button--only-icon']]: [label, children, count].every(isNil) && withIcon,
      },
      className,
    );
  }, [
    disabled,
    variant,
    size,
    rounded,
    bold,
    label,
    children,
    count,
    withIcon,
    className,
    fullWidth,
  ]);

  const renderIcon = React.useCallback(() => {
    if (!withIcon) {
      return null;
    }

    return (
      <Icon
        name={withIcon}
        width={18}
        height={18}
        className={clsx(styles['button__icon'], iconClassName)}
      />
    );
  }, [iconClassName, withIcon]);

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      <div
        className={clsx(styles['button__label'], {
          [styles['button__label--hidden']]: isLoading,
        })}
      >
        {!iconAfter && withIcon && renderIcon()}
        {children ?? label}
        {!isNil(count) && <p className={styles['button__count']}>{count}</p>}
        {iconAfter && withIcon && renderIcon()}
      </div>
      {isLoading && (
        <div className={styles['button__loader']}>
          <Loader colorful={variant === 'secondary'} />
        </div>
      )}
    </button>
  );
};
