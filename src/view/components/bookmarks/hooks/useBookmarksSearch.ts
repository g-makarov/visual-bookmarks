import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { ChromeBookmarks } from '~/services/ChromeBookmarks';

interface UseBookmarksSearchProps {
  searchQuery: string;
  onBeforeSearch?: () => void;
}

interface UseBookmarksSearchReturn {
  searchResults: chrome.bookmarks.BookmarkTreeNode[];
  isSearchMode: boolean;
}

export function useBookmarksSearch({
  searchQuery,
  onBeforeSearch,
}: UseBookmarksSearchProps): UseBookmarksSearchReturn {
  const [searchResults, setSearchResults] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);
  const [debouncedSearchValue] = useDebounce(searchQuery, 300);
  const isSearchMode = Boolean(debouncedSearchValue);

  useEffect(() => {
    (async () => {
      if (isSearchMode) {
        onBeforeSearch?.();
        const searchResults = await ChromeBookmarks.searchBookmarks({
          query: searchQuery,
        });
        const bookmarks = searchResults.filter(result => result.url);
        setSearchResults(bookmarks);
      } else {
        setSearchResults([]);
      }
    })();
  }, [isSearchMode, searchQuery]);

  return { isSearchMode, searchResults };
}
