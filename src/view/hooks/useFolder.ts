import { useEffect, useState } from 'react';

export function useFolder(folderId: string | null): chrome.bookmarks.BookmarkTreeNode | null {
  const [folder, setFolder] = useState<chrome.bookmarks.BookmarkTreeNode | null>(null);

  useEffect(() => {
    if (folderId) {
      chrome.bookmarks.get(folderId, ([bookmark]) => {
        setFolder(bookmark);
      });
    }
  }, [folderId]);

  return folder;
}
