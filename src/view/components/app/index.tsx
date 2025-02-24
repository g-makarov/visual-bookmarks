import { useUnit } from 'effector-react';
import React, { useLayoutEffect, type FC } from 'react';
import { Toaster } from 'react-hot-toast';

import { $rootBookmark, fetchRootBookmark } from '~/features/bookmarks';
import { Bookmarks } from '~/view/components/bookmarks';

import styles from './styles.module.scss';

export const App: FC = () => {
  const rootBookmark = useUnit($rootBookmark);

  useLayoutEffect(() => {
    fetchRootBookmark();
  }, []);

  return (
    <main className={styles['app-wrapper']}>
      {rootBookmark && <Bookmarks rootNode={rootBookmark} />}
      <div className="mb-4 flex self-center text-p3 text-gray-2">
        <a
          href="https://www.buymeacoffee.com/gmakarov"
          className="hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy me a coffee
        </a>
        <span className="mx-2">•</span>
        <a
          href="https://forms.gle/E7juWNAWncFj45sB9"
          className="hover:underline"
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
