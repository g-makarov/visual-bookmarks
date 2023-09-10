import { createEffect, createEvent, createStore } from 'effector';
import { persist } from 'effector-storage/local';

import { ChromeBookmarks } from '~/services/ChromeBookmarks';

export const fetchRootBookmark = createEffect(async () => {
  const tree = await ChromeBookmarks.getTree();
  if (tree[0]) {
    return tree[0];
  }
  return null;
});

export const removeBookmark = createEffect(async (id: string) => {
  await chrome.bookmarks.removeTree(id);
  await fetchRootBookmark();
});

export const $rootBookmark = createStore<Nullable<chrome.bookmarks.BookmarkTreeNode>>(null).on(
  fetchRootBookmark.doneData,
  (_, payload) => payload,
);

export interface BookmarkSettings {
  logoUrl?: string;
}

export const updateBookmarkSettings = createEvent<{
  id: chrome.bookmarks.BookmarkTreeNode['id'];
  settings: BookmarkSettings;
}>();

export const $bookmarksSettings = createStore<
  Record<chrome.bookmarks.BookmarkTreeNode['id'], BookmarkSettings>
>({}).on(updateBookmarkSettings, (state, { id, settings }) => ({
  ...state,
  [id]: settings,
}));

persist({ store: $bookmarksSettings, key: 'bookmarksSettings' });

$bookmarksSettings.watch(state => console.log('$bookmarksSettings: ', state));
