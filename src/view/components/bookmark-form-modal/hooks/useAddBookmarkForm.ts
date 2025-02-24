import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useMemo } from 'react';
import { useForm, type UseFormHandleSubmit, type UseFormReturn } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { formErrors } from '~/constants/form';
import { fetchRootBookmark, updateBookmarkSettings } from '~/features/bookmarks';
import { ChromeBookmarks } from '~/services/ChromeBookmarks';

const formSchema = z
  .object({
    name: z.string().min(1, formErrors.REQUIRED),
    url: z.string(),
    customLogoUrl: z.string(),
    isFolder: z.boolean(),
    newFolderId: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.isFolder && !z.string().url().safeParse(data.url).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid link',
        path: ['url'],
      });
    }
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
  newFolderId: '',
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
    defaultValues: folderId ? { ...defaultValues, newFolderId: folderId } : defaultValues,
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

          await chrome.bookmarks.move(bookmark.id, { parentId: values.newFolderId });

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
            parentId: values.newFolderId,
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
    [isEditMode, onSubmitSuccessful, bookmark, isFolder, selectedLogo, folderId],
  );

  return useMemo(
    () => ({ form, handleSubmit: form.handleSubmit(handleSubmit) }),
    [form, handleSubmit],
  );
}
