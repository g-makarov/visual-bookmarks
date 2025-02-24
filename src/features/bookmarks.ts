import { createEffect, createEvent, createStore, sample, type UnitValue } from 'effector';
import { persist } from 'effector-storage/local';

import { ChromeBookmarks } from '~/services/ChromeBookmarks';

export const updateBaseFolderId = createEvent<Nullable<string>>();

export const $baseFolderId = createStore<Nullable<string>>(null).on(
  updateBaseFolderId,
  (_, payload) => payload,
);

persist({ store: $baseFolderId, key: 'baseFolderId' });

export const fetchRootBookmarkFx = createEffect<
  { baseFolderId: UnitValue<typeof $baseFolderId> },
  chrome.bookmarks.BookmarkTreeNode | null
>(async ({ baseFolderId }) => {
  let tree;

  if (baseFolderId) {
    tree = await ChromeBookmarks.getSubTree(baseFolderId);
  } else {
    tree = await ChromeBookmarks.getTree();
  }

  if (tree[0]) {
    return tree[0];
  }

  return null;
});

export const fetchRootBookmark = createEvent();

sample({
  clock: fetchRootBookmark,
  source: { baseFolderId: $baseFolderId },
  target: fetchRootBookmarkFx,
});

sample({
  clock: updateBaseFolderId,
  target: fetchRootBookmark,
});

export const removeBookmark = createEffect(async (id: string) => {
  await chrome.bookmarks.removeTree(id);
  fetchRootBookmark();
});

export const $rootBookmark = createStore<Nullable<chrome.bookmarks.BookmarkTreeNode>>(null).on(
  fetchRootBookmarkFx.doneData,
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

const TABS_FOLDER = '__tabs__';

export const createTab = createEffect(async (bookmarkId: string) => {
  const bookmark = await ChromeBookmarks.createFolderIfNotExist(TABS_FOLDER);
  await chrome.bookmarks.move(bookmarkId, { parentId: bookmark.id });
  console.log(bookmark);
});

// const [foundTabsFolder] = await ChromeBookmarks.searchBookmarks({ title: TABS_FOLDER });

export const $currentTab = createStore<chrome.bookmarks.BookmarkTreeNode | null>(null);
