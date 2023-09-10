import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm, UseFormHandleSubmit, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { formErrors } from '~/constants/form';

const formSchema = z.object({
  name: z.string().min(1, formErrors.REQUIRED),
  url: z.string(),
  isFolder: z.boolean(),
});

type AddBookmarkFormValues = z.infer<typeof formSchema>;

interface UseAddBookmarkFormReturn {
  form: UseFormReturn<AddBookmarkFormValues>;
  handleSubmit: ReturnType<UseFormHandleSubmit<AddBookmarkFormValues>>;
}

const defaultValues: AddBookmarkFormValues = {
  name: '',
  url: '',
  isFolder: false,
};

export function useAddBookmarkForm(): UseAddBookmarkFormReturn {
  const form = useForm<AddBookmarkFormValues>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = useCallback(async (values: AddBookmarkFormValues) => {
    try {
      console.log(values);
      // server request
    } catch (e) {
      // handle error
    }
  }, []);

  return useMemo(
    () => ({ form, handleSubmit: form.handleSubmit(handleSubmit) }),
    [form, handleSubmit],
  );
}
