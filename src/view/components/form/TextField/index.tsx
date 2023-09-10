import * as React from 'react';
import { Control, FieldPathByValue, FieldValues, useController } from 'react-hook-form';

import { Field, FieldProps } from '~/view/components/form/Field';
import { TextInput, TextInputProps } from '~/view/components/form/TextInput';

type AllowedInputProps = Pick<
  TextInputProps,
  'autoComplete' | 'autoFocus' | 'size' | 'placeholder' | 'maxLength' | 'disabled'
>;
type AllowedFieldProps = Pick<FieldProps, 'label' | 'className' | 'required'>;

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
  required,
  placeholder,
  ...textInputProps
}: TextFieldProps<TFormValues, TName>): React.ReactElement => {
  const controller = useController({ name, control });

  return (
    <Field {...{ className, label, required }} error={controller.fieldState.error}>
      <TextInput
        {...controller.field}
        error={!!controller.fieldState.error}
        placeholder={placeholder ?? label}
        {...textInputProps}
      />
    </Field>
  );
};
