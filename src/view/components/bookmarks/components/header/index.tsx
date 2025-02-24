import { ArrowLeftIcon, EditIcon, MoreVerticalIcon, PlusIcon } from 'lucide-react';
import React, { type FC } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { SettingsModal } from '~/view/components/settings-modal';
import { Button } from '~/view/components/ui/button';
import { Modal } from '~/view/components/ui/modal';
import { SearchInput } from '~/view/components/ui/search-input';
import { useSwitchValue } from '~/view/hooks/useSwitchValue';

interface Props {
  prev: () => void;
  path: number[];
  add: () => void;
  onSearch: (value: string) => void;
  searchValue: string;
  isSearchMode: boolean;
}

export const Header: FC<Props> = ({ prev, path, add, onSearch, searchValue, isSearchMode }) => {
  const { value: isSettingsOpen, on: openSettings, off: closeSettings } = useSwitchValue(false);

  return (
    <div className="relative my-10 flex w-full items-center gap-2">
      <Button
        icon={ArrowLeftIcon}
        onClick={prev}
        disabled={path.length === 0}
        className="w-12 p-0"
        variant="primary"
        size="large"
      />
      <SearchInput
        className="flex-1"
        inputClassName="border-none"
        onChange={onSearch}
        placeholder="Search bookmarks"
        defaultValue={searchValue}
        debounceDelay={100}
        inputSize="large"
      />
      <Button
        icon={PlusIcon}
        onClick={add}
        variant="primary"
        className="w-12 p-0"
        disabled={isSearchMode}
        size="large"
      />
      <Button
        icon={MoreVerticalIcon}
        variant="primary"
        size="large"
        className="w-12 p-0"
        onClick={openSettings}
      />
      {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} close={closeSettings} />}
      {/* <DropdownMenu>
        <DropdownMenuTrigger>
          <Button icon={MoreVerticalIcon} variant="primary" size="large" className="w-12 p-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem>
            <PlusIcon />
            <span>Add new bookmark</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EditIcon />
            <span>Edit</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
};
