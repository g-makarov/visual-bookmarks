import clsx from 'clsx';
import React from 'react';
import { FieldError } from 'react-hook-form';

export interface FieldErrorMessageProps {
  error?: FieldError;
  className?: string;
}

export const FieldErrorMessage: React.FC<FieldErrorMessageProps> = ({ error, className }) => {
  if (!error) {
    return null;
  }
  return <p className={clsx('form__error', className)}>{error.message}</p>;
};
