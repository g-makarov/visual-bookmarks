import { useStore } from 'effector-react';
import React, { FC, useLayoutEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import { $rootBookmark, fetchRootBookmark } from '~/features/bookmarks';
import { Bookmarks } from '~/view/components/bookmarks';

import styles from './styles.module.scss';

export const App: FC = () => {
  const rootBookmark = useStore($rootBookmark);

  useLayoutEffect(() => {
    fetchRootBookmark();
  }, []);

  return (
    <main className={styles['app-wrapper']}>
      {rootBookmark && <Bookmarks rootNode={rootBookmark} />}
      <Toaster />
    </main>
  );
};
