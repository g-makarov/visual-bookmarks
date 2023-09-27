import { useStoreMap } from 'effector-react';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { $bookmarksSettings, BookmarkSettings } from '~/features/bookmarks';
import { ChromeBookmarks } from '~/services/ChromeBookmarks';
import { createLogoUrl } from '~/utils/createLogoUrl';
import { preloadImage } from '~/utils/preloadImage';
import { BookmarkTilePreview } from '~/view/components/bookmark-tile-preview';
import { Checkbox } from '~/view/components/ui/form/checkbox';
import { Field } from '~/view/components/ui/form/field';
import { TextField } from '~/view/components/ui/form/text-field';
import { Modal } from '~/view/components/ui/modal';
import { useUpdateEffect } from '~/view/hooks/useUpdateEffect';

import { useAddBookmarkForm } from './hooks/useAddBookmarkForm';
import styles from './styles.module.scss';

interface Props {
  isOpen: boolean;
  close: () => void;
  folderId?: string;
  bookmark?: chrome.bookmarks.BookmarkTreeNode;
}

export const BookmarkFormModal: React.FC<Props> = ({ isOpen, close, folderId, bookmark }) => {
  const settings = useStoreMap({
    store: $bookmarksSettings,
    keys: [bookmark?.id],
    fn: (bookmarksSettings, [id]): undefined | BookmarkSettings =>
      id ? bookmarksSettings[id] : undefined,
  });

  const [selectedLogo, setSelectedLogo] = useState<'default' | 'custom'>(
    settings?.logoUrl ? 'custom' : 'default',
  );

  const { form, handleSubmit } = useAddBookmarkForm({
    bookmark,
    selectedLogo,
    folderId,
    onSubmitSuccessful: close,
  });

  const isFolder = form.watch('isFolder');
  const isEditMode = !!bookmark;

  useLayoutEffect(() => {
    if (isOpen && bookmark) {
      form.reset({
        name: bookmark.title,
        url: bookmark.url ?? '',
        customLogoUrl: settings?.logoUrl ?? '',
        isFolder: ChromeBookmarks.isFolder(bookmark),
      });
    }

    if (!isOpen) {
      form.reset();
    }
  }, [isOpen]);

  const name = form.watch('name');
  const url = form.watch('url');
  const [defaultLogo, setDefaultLogo] = useState<string | null>(null);
  const [debouncedUrl] = useDebounce(url, 300);

  const customLogoUrl = form.watch('customLogoUrl');
  const [customLogo, setCustomLogo] = useState<string | null>(settings?.logoUrl ?? null);
  const [debouncedCustomLogoUrl] = useDebounce(customLogoUrl, 300);

  useUpdateEffect(() => {
    if (!debouncedUrl) {
      setDefaultLogo(null);
      return;
    }

    (async () => {
      const logo = createLogoUrl(debouncedUrl);
      const imageStatus = await preloadImage(logo);
      setDefaultLogo(imageStatus === 'ready' ? logo : null);
    })();
  }, [debouncedUrl]);

  useEffect(() => {
    setSelectedLogo(customLogo ? 'custom' : 'default');
  }, [customLogo]);

  useUpdateEffect(() => {
    if (!debouncedCustomLogoUrl) {
      setCustomLogo(null);
      return;
    }

    (async () => {
      const imageStatus = await preloadImage(debouncedCustomLogoUrl);
      if (imageStatus === 'ready') {
        setCustomLogo(debouncedCustomLogoUrl);
      } else {
        form.setError('customLogoUrl', { message: 'Invalid image' });
        setCustomLogo(null);
      }
    })();
  }, [debouncedCustomLogoUrl]);

  return (
    <Modal
      isOpen={isOpen}
      close={close}
      title={`${isEditMode ? 'Update' : 'Create'} bookmark`}
      buttons={[
        { label: 'Cancel', variant: 'secondary', onClick: close },
        { label: 'Save', variant: 'primary', onClick: handleSubmit },
      ]}
    >
      <div className="mt-5">
        {!isEditMode && (
          <Checkbox {...form.register('isFolder')} label="Is folder?" className="mb-4" />
        )}
        <TextField control={form.control} label="Name" name="name" autoComplete={false} />
        <TextField
          control={form.control}
          label="Link"
          name="url"
          autoComplete={false}
          disabled={isFolder}
        />
        <div className="mt-4">
          <Field label="Bookmark logo">
            <div className="flex gap-2 mt-2">
              <div className="flex flex-col items-center">
                <BookmarkTilePreview
                  highlighted={selectedLogo === 'default'}
                  onClick={() => setSelectedLogo('default')}
                  logo={defaultLogo}
                  name={name}
                />
                <div className={styles['preview-tile-badge']}>Default</div>
              </div>
              {customLogo && (
                <div className="flex flex-col items-center">
                  <BookmarkTilePreview
                    highlighted={selectedLogo === 'custom'}
                    onClick={() => setSelectedLogo('custom')}
                    logo={customLogo}
                    name={name}
                  />
                  <div className={styles['preview-tile-badge']}>Custom</div>
                </div>
              )}
            </div>
          </Field>
          <TextField
            control={form.control}
            label="Custom logo link"
            name="customLogoUrl"
            autoComplete={false}
            disabled={isFolder}
          />
        </div>
      </div>
    </Modal>
  );
};
