import React, { CSSProperties } from 'react';

interface Props {
  name: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  size?: number;
  style?: CSSProperties;
}

export const Icon: React.FC<Props> = ({
  name,
  className,
  size,
  style,
  width = '100%',
  height = '100%',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={size !== undefined ? size : width}
    height={size !== undefined ? size : height}
    className={className}
    style={style}
  >
    <use xlinkHref={`/icons/spritemap.svg#${name}`} />
  </svg>
);
