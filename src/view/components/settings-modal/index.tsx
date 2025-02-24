import { useUnit } from 'effector-react';
import React from 'react';

import { $baseFolderId, $rootBookmark, updateBaseFolderId } from '~/features/bookmarks';
import { Modal } from '~/view/components/ui/modal';

import { BookmarksFolderSelect } from '../bookmarks-folder-select';

interface Props {
  isOpen: boolean;
  close: () => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, close }) => {
  const rootBookmark = useUnit($rootBookmark);
  const baseFolderId = useUnit($baseFolderId);

  return (
    <Modal isOpen={isOpen} close={close} title="Settings">
      Select base folder
      <BookmarksFolderSelect
        onSelect={id => updateBaseFolderId(id)}
        selected={baseFolderId ?? rootBookmark?.id ?? ''}
        className="mt-2"
      />
    </Modal>
  );
};
