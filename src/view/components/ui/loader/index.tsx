import clsx from 'clsx';
import * as React from 'react';

import styles from './styles.module.scss';

export interface LoaderProps {
  full?: boolean;
  colorful?: boolean;
  dotSize?: number;
}

export const Loader: React.FC<LoaderProps> = ({ full, colorful, dotSize = 10 }) => {
  const dotStyle = React.useMemo(
    () => ({
      width: `${dotSize}px`,
      height: `${dotSize}px`,
    }),
    [dotSize],
  );

  const loader = React.useMemo(() => {
    return (
      <div className={clsx(styles['container'], { [styles['container--colorful']]: colorful })}>
        <div className={styles['dot']} style={dotStyle} />
        <div className={styles['dot']} style={dotStyle} />
        <div className={styles['dot']} style={dotStyle} />
      </div>
    );
  }, [colorful, dotStyle]);

  if (!full) {
    return loader;
  }

  return <div className={styles['full-wrapper']}>{loader}</div>;
};
