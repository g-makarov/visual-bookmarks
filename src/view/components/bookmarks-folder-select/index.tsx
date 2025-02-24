import clsx from 'clsx';
import React, { useEffect, useState, type ReactNode } from 'react';

import { ChromeBookmarks } from '~/services/ChromeBookmarks';
import { bookmarksMock } from '~/services/mock';
import { TextInput } from '~/view/components/ui/form/text-input';
import { Modal } from '~/view/components/ui/modal';
import { useFolder } from '~/view/hooks/useFolder';
import { useSwitchValue } from '~/view/hooks/useSwitchValue';

import styles from './styles.module.scss';

interface Props {
  onSelect: (bookmarkId: string) => void;
  selected: string;
  className?: string;
}

export const BookmarksFolderSelect: React.FC<Props> = ({ onSelect, selected, className }) => {
  const [bookmarksTree, setBookmarksTree] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);
  const { value: isMoveModalOpen, on: openMoveModal, off: closeMoveModal } = useSwitchValue(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setBookmarksTree(bookmarksMock);
    } else {
      chrome.bookmarks.getTree(([tree]) => setBookmarksTree(tree.children ?? []));
    }
  }, []);

  const renderFolders = (
    bookmarks: chrome.bookmarks.BookmarkTreeNode[] | undefined,
    depth = 1,
  ): ReactNode => {
    if (bookmarks === undefined) {
      return null;
    }

    const filteredBookmarks = bookmarks.filter(ChromeBookmarks.isFolder);

    return filteredBookmarks.map(bookmark => (
      <div key={bookmark.id}>
        <button
          type="button"
          className={clsx(
            styles['list__item'],
            selected === bookmark.id && styles['list__item--active'],
          )}
          onClick={() => {
            onSelect(bookmark.id);
            closeMoveModal();
          }}
        >
          <div className={styles['bookmark__name']}>→ {bookmark.title}</div>
        </button>
        <div style={{ paddingLeft: 15 * depth }}>{renderFolders(bookmark.children, depth + 1)}</div>
      </div>
    ));
  };

  const folder = useFolder(selected);

  return (
    <>
      <TextInput readOnly onClick={openMoveModal} value={folder?.title} placeholder="Folder" />
      <Modal isOpen={isMoveModalOpen} close={closeMoveModal}>
        <div className={clsx(styles['list'], className)}>{renderFolders(bookmarksTree)}</div>
      </Modal>
    </>
  );
};
