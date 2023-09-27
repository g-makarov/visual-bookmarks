import React from 'react';

import { useClickAway } from '~/view/hooks/useClickAway';

import styles from './styles.module.scss';

interface ContextMenuItem {
  label: string;
  onClick: () => void;
}

interface Props {
  x: number;
  y: number;
  items: ContextMenuItem[];
  close: () => void;
}

export const ContextMenu: React.FC<Props> = ({ x, y, items, close }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useClickAway(ref, close);

  return (
    <div ref={ref} style={{ top: y, left: x }} className={styles['menu']}>
      {items.map(item => (
        <div
          key={item.label}
          onClick={e => {
            e.stopPropagation();
            close();
            item.onClick();
          }}
          className={styles['menu__option']}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};
