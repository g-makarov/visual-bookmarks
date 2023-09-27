import React, { FC, useMemo } from 'react';
import { Dropdown, DropdownItem } from 'react-nested-dropdown';

import styles from '~/view/components/bookmarks/styles.module.scss';
import { Button } from '~/view/components/ui/button';
import { SearchInput } from '~/view/components/ui/search-input';

interface Props {
  prev: () => void;
  path: number[];
  add: () => void;
  onSearch: (value: string) => void;
  searchValue: string;
  isSearchMode: boolean;
}

export const Header: FC<Props> = ({ prev, path, add, onSearch, searchValue, isSearchMode }) => {
  const dropdownItems: DropdownItem[] = useMemo(
    () => [{ label: 'Add new bookmark', onSelect: add }],
    [add],
  );

  return (
    <div className={styles['header']}>
      <Button
        withIcon="back"
        onClick={prev}
        disabled={path.length === 0}
        className={styles['header__back-btn']}
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
        withIcon="add"
        onClick={add}
        variant="primary"
        className={styles['header__add-btn']}
        disabled={isSearchMode}
        size="large"
      />
      <Dropdown items={dropdownItems}>
        {({ onClick }) => (
          <Button
            withIcon="more"
            onClick={onClick}
            variant="primary"
            size="large"
            className={styles['header__add-btn']}
          />
        )}
      </Dropdown>
    </div>
  );
};
