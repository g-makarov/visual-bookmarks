import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { useStoreMap } from 'effector-react';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { $bookmarksSettings, BookmarkSettings, removeBookmark } from '~/features/bookmarks';
import { ChromeBookmarks } from '~/services/ChromeBookmarks';
import { createLogoUrl } from '~/utils/createLogoUrl';
import { preloadImage } from '~/utils/preloadImage';
import { AddBookmarkModal } from '~/view/components/AddBookmarkModal';
import { MoveBookmarkModal } from '~/view/components/Bookmarks/components/Bookmark/components/MoveBookmarkModal';
import { ContextMenu } from '~/view/components/Bookmarks/components/ContextMenu';
import { Icon } from '~/view/components/Icon';
import { useKey } from '~/view/hooks/useKey';
import { useSwitchValue } from '~/view/hooks/useSwitchValue';

import styles from './styles.module.scss';

interface BookmarkProps {
  data: chrome.bookmarks.BookmarkTreeNode;
  next: (index: number) => void;
  index: number;
  hotkeyDisabled?: boolean;
}

export const Bookmark: FC<BookmarkProps> = ({ data, next, index, hotkeyDisabled = false }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: data.id,
  });

  const settings = useStoreMap({
    store: $bookmarksSettings,
    keys: [data.id],
    fn: (bookmarksSettings, [id]): undefined | BookmarkSettings => bookmarksSettings[id],
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isFolder = ChromeBookmarks.isFolder(data);

  const handleClick = useCallback(async () => {
    if (isFolder) {
      next(index);
      return;
    }
    if (data.url) {
      window.location.href = data.url;
    }
  }, [isFolder, data, next, index]);

  const handleRemoveClick = (): void => {
    if (window.confirm(`Are you sure you want to delete "${data.title}"?`)) {
      removeBookmark(data.id);
    }
  };

  const isHotkey = index + 1 < 10 && !hotkeyDisabled;
  const hotkey = isHotkey ? `${index + 1}` : null;

  useKey(hotkey, handleClick);

  const [points, setPoints] = useState<{ x: number; y: number } | null>(null);

  const [imageStatus, setImageStatus] = useState<'error' | 'ready' | 'idle'>(
    settings?.logoUrl ? 'ready' : 'idle',
  );

  useEffect(() => {
    if (!ChromeBookmarks.isBookmark(data)) {
      return;
    }

    if (settings?.logoUrl) {
      setImageStatus('ready');
      return;
    }

    (async () => {
      const status = await preloadImage(createLogoUrl(data.url));
      setImageStatus(status);
    })();
  }, [data]);

  const { value: isEditModalOpen, on: openEditModal, off: closeEditModal } = useSwitchValue(false);
  const { value: isMoveModalOpen, on: openMoveModal, off: closeMoveModal } = useSwitchValue(false);

  return (
    <>
      <button
        ref={setNodeRef}
        type="button"
        className={styles['bookmark']}
        style={style}
        onClick={handleClick}
        onContextMenu={e => {
          setPoints({
            x: e.pageX,
            y: e.pageY,
          });
        }}
        {...attributes}
        {...listeners}
      >
        <div
          className={clsx(styles['bookmark__tile'], {
            [styles['bookmark__tile--dragging']]: isDragging,
          })}
        >
          {hotkey !== null && <div className={styles['bookmark__hotkey']}>{hotkey}</div>}
          {ChromeBookmarks.isBookmark(data) && (
            <div className={styles['bookmark__logo']}>
              {imageStatus === 'ready' && (
                <img
                  src={settings?.logoUrl ? settings.logoUrl : createLogoUrl(data.url)}
                  alt={data.title}
                />
              )}
              {imageStatus === 'error' && (
                <div className={styles['bookmark__logo-title']}>{data.title[0]}</div>
              )}
            </div>
          )}
          {isFolder && <Icon name="folder" className={styles['bookmark__folder-icon']} size={24} />}
        </div>
        <div className={styles['bookmark__title']}>{data.title}</div>
        {points && (
          <ContextMenu
            x={points.x}
            y={points.y}
            close={() => setPoints(null)}
            items={[
              {
                label: 'Edit',
                onClick: openEditModal,
              },
              { label: 'Move to folder', onClick: openMoveModal },
              { label: 'Delete', onClick: handleRemoveClick },
            ]}
          />
        )}
      </button>
      {isEditModalOpen && (
        <AddBookmarkModal isOpen={isEditModalOpen} close={closeEditModal} bookmark={data} />
      )}
      {isMoveModalOpen && (
        <MoveBookmarkModal isOpen={isMoveModalOpen} close={closeMoveModal} bookmarkId={data.id} />
      )}
    </>
  );
};
