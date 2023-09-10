import { useStore } from 'effector-react';
import React, { FC, useLayoutEffect } from 'react';

import { $rootBookmark, fetchRootBookmark } from '~/features/bookmarks';
import { Bookmarks } from '~/view/components/Bookmarks';
import { Toaster } from '~/view/components/Toaster';

import styles from './styles.module.scss';

export const App: FC = () => {
  const rootBookmark = useStore($rootBookmark);

  useLayoutEffect(() => {
    fetchRootBookmark();
  }, []);

  return (
    <main className={styles['app-wrapper']}>
      {rootBookmark && <Bookmarks rootNode={rootBookmark} />}
      <div className="flex self-center text-gray-2 mb-4 text-p3">
        <a
          href="https://www.buymeacoffee.com/gmakarov"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy me a coffee
        </a>
        <span className="mx-2">•</span>
        <a
          href="https://forms.gle/E7juWNAWncFj45sB9"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Leave feedback
        </a>
      </div>
      <Toaster />
    </main>
  );
};
