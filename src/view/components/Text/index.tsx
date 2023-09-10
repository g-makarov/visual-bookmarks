import clsx from 'clsx';
import React from 'react';

import styles from './styles.module.scss';

interface Props {
  weight?: TextWeight;
  children: React.ReactNode;
  tag?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
  style?: TextStyle;
  accent?: boolean;
  primary?: boolean;
  secondary?: boolean;
  className?: string;
  align?: TextAlign;
  title?: string;
  breakWord?: boolean;
  white?: boolean;
  nowrap?: boolean;
}

export enum TextWeight {
  REGULAR = 'regular',
  MEDIUM = 'medium',
  BOLD = 'bold',
}

export enum TextAlign {
  CENTER = 'center',
  LEFT = 'left',
  RIGHT = 'right',
}

export enum TextStyle {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  CAPTION = 'caption',
}

export const Text: React.FC<Props> = ({
  children,
  style,
  tag = 'p',
  secondary = false,
  weight,
  className,
  align,
  title,
  nowrap,
  accent = false,
  breakWord = true,
  white = false,
  primary = false,
}) => {
  const combinedClassName = React.useMemo(() => {
    return clsx(
      styles['text'],
      style ? styles[`text--${style}`] : undefined,
      {
        [styles['text--secondary']]: secondary,
        [styles['text--accent']]: accent,
        [styles['text--primary']]: primary,
        [styles[`text--${weight}`]]: weight,
        [styles[`text--${align}`]]: align,
        [styles['text--break']]: breakWord,
        [styles['text--white']]: white,
        [styles['text--nowrap']]: nowrap,
      },
      className,
    );
  }, [accent, align, breakWord, className, primary, secondary, style, weight, white, nowrap]);

  return React.createElement(tag, { className: combinedClassName, title }, children);
};
