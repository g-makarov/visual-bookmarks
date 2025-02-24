import * as React from 'react';
import {
  useController,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from 'react-hook-form';

import { Field, type FieldProps } from '~/view/components/ui/form/field';
import { TextInput, type TextInputProps } from '~/view/components/ui/form/text-input';

type AllowedInputProps = Pick<
  TextInputProps,
  'autoComplete' | 'autoFocus' | 'size' | 'placeholder' | 'maxLength' | 'disabled'
>;
type AllowedFieldProps = Pick<FieldProps, 'label' | 'className' | 'optional'>;

export interface TextFieldProps<
  TFormValues extends FieldValues,
  TName extends FieldPathByValue<TFormValues, number | string>,
> extends AllowedInputProps,
    AllowedFieldProps {
  name: TName;
  control: Control<TFormValues>;

  // input type
  type?: 'text' | 'email' | 'search' | 'tel' | 'url' | 'number';
}

export const TextField = <
  TFormValues extends FieldValues,
  TName extends FieldPathByValue<TFormValues, number | string>,
>({
  name,
  control,
  label,
  className,
  placeholder,
  optional,
  ...textInputProps
}: TextFieldProps<TFormValues, TName>): React.ReactElement => {
  const controller = useController({ name, control });

  return (
    <Field {...{ className, label, optional }} error={controller.fieldState.error}>
      <TextInput
        {...controller.field}
        error={!!controller.fieldState.error}
        placeholder={placeholder ?? label}
        {...textInputProps}
      />
    </Field>
  );
};
