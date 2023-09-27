import React, { ReactNode, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { fetchRootBookmark } from '~/features/bookmarks';
import { ChromeBookmarks } from '~/services/ChromeBookmarks';
import { Modal } from '~/view/components/ui/modal';

import styles from './styles.module.scss';

interface Props {
  isOpen: boolean;
  close: () => void;
  bookmarkId: string;
}

export const BookmarksFolderSelect: React.FC<Props> = ({ isOpen, close, bookmarkId }) => {
  const [bookmarksTree, setBookmarksTree] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);

  useEffect(() => {
    chrome.bookmarks.getTree(([tree]) => setBookmarksTree(tree.children ?? []));
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
        <div
          className={styles['list__item']}
          onClick={async () => {
            try {
              await chrome.bookmarks.move(bookmarkId, { parentId: bookmark.id });
              fetchRootBookmark();
              toast.success('Bookmark successfully moved');
              close();
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <div className={styles['bookmark__name']}>→ {bookmark.title}</div>
        </div>
        <div style={{ paddingLeft: 15 * depth }}>{renderFolders(bookmark.children, depth + 1)}</div>
      </div>
    ));
  };

  return (
    <Modal isOpen={isOpen} close={close} title="Move bookmark">
      <div className={styles['list']}>{renderFolders(bookmarksTree)}</div>
    </Modal>
  );
};
