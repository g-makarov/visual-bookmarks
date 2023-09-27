import clsx from 'clsx';
import * as React from 'react';
import { ReactNode } from 'react';
import ReactModal from 'react-modal';

import { Button, ButtonProps } from '~/view/components/ui/button';
import { Icon } from '~/view/components/ui/icon';

import styles from './styles.module.scss';

export interface ModalProps {
  /**
   * Open state
   */
  isOpen: boolean;
  /**
   * Close handler
   */
  close(): void;
  /**
   * Title
   */
  title?: ReactNode;
  /**
   * Description
   */
  description?: ReactNode;
  /**
   * Footer buttons
   */
  buttons?: ButtonProps[];
  /**
   * Modal content
   */
  children: React.ReactNode;
  /**
   * Show close button
   */
  withCloseButton?: boolean;
  /**
   * Additional class name for modal content
   */
  contentClassName?: string;
  /**
   * Additional class name for modal body
   */
  bodyClassName?: string;
  /**
   * Content position
   */
  position?: 'center' | 'right';
  /**
   * Close on overlay click
   */
  shouldCloseOnOverlayClick?: boolean;
  /**
   * Callback that will be called after modal is closed
   */
  onAfterClose?: () => void;
}

const app = document.querySelector('#root') as HTMLElement;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  close,
  title,
  buttons,
  children,
  contentClassName,
  bodyClassName,
  onAfterClose,
  withCloseButton = true,
  position = 'center',
  shouldCloseOnOverlayClick = true,
  description,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      appElement={app}
      onRequestClose={close}
      contentLabel={typeof title === 'string' ? title : undefined}
      className={clsx(styles['modal'], styles[`modal--${position}`], contentClassName)}
      overlayClassName={styles['modal-overlay']}
      shouldCloseOnEsc={shouldCloseOnOverlayClick}
      bodyOpenClassName="react-modal-opened"
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      onAfterClose={onAfterClose}
    >
      {Boolean(title || description || withCloseButton) && (
        <div className={styles['modal__header']}>
          {withCloseButton && (
            <button type="button" className={styles['modal__close-btn']} onClick={close}>
              <Icon name="close" size={20} />
            </button>
          )}
          {Boolean(title || description) && (
            <div className={styles['modal__header-content']}>
              {title && <div className={styles['modal__title']}>{title}</div>}
              {description && <div className={styles['modal__description']}>{description}</div>}
            </div>
          )}
        </div>
      )}
      <div className={clsx(styles['modal__content'], bodyClassName)}>{children}</div>
      {buttons && buttons.length > 0 && (
        <div className={styles['modal__buttons-list']}>
          {buttons.map(({ className, ...props }, index) => (
            <Button key={index} {...props} className={clsx(styles['modal__button'], className)} />
          ))}
        </div>
      )}
    </ReactModal>
  );
};
