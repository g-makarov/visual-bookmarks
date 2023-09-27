import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm, UseFormHandleSubmit, UseFormReturn } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { formErrors } from '~/constants/form';
import { fetchRootBookmark, updateBookmarkSettings } from '~/features/bookmarks';
import { ChromeBookmarks } from '~/services/ChromeBookmarks';

const formSchema = z
  .object({
    name: z.string().min(1, formErrors.REQUIRED),
    url: z.string().url('Invalid link'),
    customLogoUrl: z.string(),
    isFolder: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.isFolder && !data.url) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: formErrors.REQUIRED,
        path: ['url'],
      });
      if (!z.string().url().safeParse(data.url).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid url',
          path: ['url'],
        });
      }
    }
  });

type AddBookmarkFormValues = z.infer<typeof formSchema>;

interface UseAddBookmarkFormReturn {
  form: UseFormReturn<AddBookmarkFormValues>;
  handleSubmit: ReturnType<UseFormHandleSubmit<AddBookmarkFormValues>>;
}

const defaultValues: AddBookmarkFormValues = {
  name: '',
  url: '',
  customLogoUrl: '',
  isFolder: false,
};

interface UseAddBookmarkFormProps {
  selectedLogo: 'default' | 'custom';
  folderId?: string;
  bookmark?: chrome.bookmarks.BookmarkTreeNode;
  onSubmitSuccessful?: () => void;
}

export function useAddBookmarkForm({
  bookmark,
  selectedLogo,
  folderId,
  onSubmitSuccessful,
}: UseAddBookmarkFormProps): UseAddBookmarkFormReturn {
  const form = useForm<AddBookmarkFormValues>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const isEditMode = !!bookmark;
  const isFolder = form.watch('isFolder');

  const handleSubmit = useCallback(
    async (values: AddBookmarkFormValues) => {
      try {
        if (isEditMode) {
          await chrome.bookmarks.update(bookmark.id, {
            title: values.name,
            url: isFolder ? undefined : values.url,
          });
          if (selectedLogo === 'custom' && values.customLogoUrl) {
            updateBookmarkSettings({
              id: bookmark.id,
              settings: { logoUrl: values.customLogoUrl },
            });
          } else if (selectedLogo === 'default') {
            updateBookmarkSettings({ id: bookmark.id, settings: { logoUrl: undefined } });
          }
        } else {
          const newBookmark = await ChromeBookmarks.create({
            title: values.name,
            url: isFolder ? undefined : values.url,
            parentId: folderId,
          });
          if (selectedLogo === 'custom' && values.customLogoUrl) {
            updateBookmarkSettings({
              id: newBookmark.id,
              settings: { logoUrl: values.customLogoUrl },
            });
          } else if (selectedLogo === 'default') {
            updateBookmarkSettings({ id: newBookmark.id, settings: { logoUrl: undefined } });
          }
        }
        fetchRootBookmark();
        toast.success('Bookmark successfully added');
        onSubmitSuccessful?.();
      } catch (e) {
        console.error(e);
      }
    },
    [form, isEditMode, onSubmitSuccessful, bookmark, isFolder, selectedLogo, folderId],
  );

  return useMemo(
    () => ({ form, handleSubmit: form.handleSubmit(handleSubmit) }),
    [form, handleSubmit],
  );
}
