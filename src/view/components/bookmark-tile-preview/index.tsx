import clsx from 'clsx';
import React from 'react';

import styles from './styles.module.scss';

interface Props {
  logo?: string | null;
  highlighted?: boolean;
  onClick?: () => void;
  name: string;
}

export const BookmarkTilePreview: React.FC<Props> = ({ logo, highlighted, onClick, name }) => {
  return (
    <button
      type="button"
      className={clsx(styles['preview-tile'], {
        [styles['preview-tile--selected']]: highlighted,
      })}
      onClick={onClick}
    >
      <div className={styles['preview-tile__logo']}>
        {logo && <img src={logo} alt="Logo" />}
        {!logo && <div className={styles['preview-tile__logo-title']}>{name[0]}</div>}
      </div>
    </button>
  );
};
