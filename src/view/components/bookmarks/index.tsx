import { DndContext, DragStartEvent, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DragEndEvent } from '@dnd-kit/core/dist/types';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { BookmarkFormModal } from '~/view/components/bookmark-form-modal';
import { useBookmarksSearch } from '~/view/components/bookmarks/hooks/useBookmarksSearch';
import { useKey } from '~/view/hooks/useKey';
import { useSwitchValue } from '~/view/hooks/useSwitchValue';

import { Bookmark } from './components/bookmark';
import { Header } from './components/header';
import styles from './styles.module.scss';

interface Props {
  rootNode: chrome.bookmarks.BookmarkTreeNode;
}

export const Bookmarks: FC<Props> = ({ rootNode }) => {
  const { value: isAddModalOpen, on: openAddModal, off: closeAddModal } = useSwitchValue(false);

  const [searchValue, setSearchValue] = useState<string>('');
  const [path, setPath] = useState<number[]>([]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const sensors = useSensors(mouseSensor);

  const next = useCallback((index: number) => {
    setPath(state => [...state, index]);
  }, []);

  const prev = useCallback(() => {
    setPath(state => state.slice(0, -1));
  }, []);

  const currentBookmarkNode = useMemo(() => {
    return path.reduce<chrome.bookmarks.BookmarkTreeNode>(
      (acc, pathIndex) => acc.children?.[pathIndex] ?? acc,
      rootNode,
    );
  }, [path, rootNode]);

  const bookmarks = useMemo(
    () => currentBookmarkNode.children ?? [],
    [currentBookmarkNode.children],
  );

  const [sortedBookmarks, setSortedBookmarks] = useState(bookmarks);

  useEffect(() => {
    setSortedBookmarks(bookmarks);
  }, [bookmarks]);

  useKey('Escape', () => {
    prev();
    setSearchValue('');
  });

  const { isSearchMode, searchResults } = useBookmarksSearch({
    searchQuery: searchValue,
    onBeforeSearch: () => setPath([]),
  });

  const [activeSortableId, setActiveSortableId] = useState<Nullable<string>>(null);

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    if (!active) {
      return;
    }
    setActiveSortableId(active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    ({ over }: DragEndEvent) => {
      setActiveSortableId(null);
      const activeIndex = activeSortableId
        ? sortedBookmarks.findIndex(bookmark => bookmark.id === activeSortableId)
        : -1;

      if (!over) return;

      const overIndex = sortedBookmarks.findIndex(bookmark => bookmark.id === over.id);
      if (activeIndex !== overIndex) {
        if (overIndex < activeIndex) {
          chrome.bookmarks.move(sortedBookmarks[activeIndex].id, { index: overIndex });
        } else {
          // https://stackoverflow.com/questions/13264060/chrome-bookmarks-api-using-move-to-reorder-bookmarks-in-the-same-folder
          chrome.bookmarks.move(sortedBookmarks[activeIndex].id, { index: overIndex + 1 });
        }
        setSortedBookmarks(items => arrayMove(items, activeIndex, overIndex));
      }
    },
    [activeSortableId, sortedBookmarks],
  );

  return (
    <div className={styles['bookmarks-container']}>
      <Header
        prev={prev}
        add={openAddModal}
        path={path}
        onSearch={setSearchValue}
        searchValue={searchValue}
        isSearchMode={isSearchMode}
      />
      <div className={styles['bookmarks-list']}>
        {isSearchMode &&
          (searchResults.length > 0 ? (
            searchResults.map((bookmark, index) => (
              <Bookmark
                key={bookmark.id}
                data={bookmark}
                next={next}
                index={index}
                hotkeyDisabled={isAddModalOpen}
              />
            ))
          ) : (
            <p className={styles['no-results']}>No results found</p>
          ))}
        {!isSearchMode && (
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext
              id={currentBookmarkNode.id}
              items={sortedBookmarks}
              strategy={rectSortingStrategy}
            >
              {sortedBookmarks.map((bookmark, index) => (
                <Bookmark
                  key={bookmark.id}
                  data={bookmark}
                  next={next}
                  index={index}
                  hotkeyDisabled={isAddModalOpen}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
      <BookmarkFormModal
        isOpen={isAddModalOpen}
        close={closeAddModal}
        folderId={currentBookmarkNode.id}
      />
    </div>
  );
};
