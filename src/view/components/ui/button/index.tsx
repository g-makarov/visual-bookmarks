import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import React, { forwardRef } from 'react';

import { isNil } from '~/utils/isNil';
import { Loader } from '~/view/components/ui/loader';

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
  iconClassName?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  iconAfter?: boolean;
  rounded?: boolean;
  bold?: boolean;
  count?: number;
  fullWidth?: boolean;
  icon?: React.ComponentType<React.SVGAttributes<SVGSVGElement>>;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      label,
      size = 'medium',
      className,
      onClick,
      icon,
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
      asChild = false,
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

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
          [styles['button--only-icon']]: [label, children, count].every(isNil) && icon,
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
      icon,
      className,
      fullWidth,
    ]);

    const renderIcon = React.useCallback(() => {
      if (!icon) {
        return null;
      }

      const IconComponent = icon;

      return (
        <IconComponent
          width={18}
          height={18}
          className={clsx(styles['button__icon'], iconClassName)}
        />
      );
    }, [iconClassName, icon]);

    return (
      <Comp
        type={type}
        className={combinedClassName}
        onClick={onClick}
        disabled={isLoading || disabled}
        ref={ref}
      >
        <div
          className={clsx(styles['button__label'], {
            [styles['button__label--hidden']]: isLoading,
          })}
        >
          {!iconAfter && icon && renderIcon()}
          {children ?? label}
          {!isNil(count) && <p className={styles['button__count']}>{count}</p>}
          {iconAfter && icon && renderIcon()}
        </div>
        {isLoading && (
          <div className={styles['button__loader']}>
            <Loader colorful={variant === 'secondary'} />
          </div>
        )}
      </Comp>
    );
  },
);
