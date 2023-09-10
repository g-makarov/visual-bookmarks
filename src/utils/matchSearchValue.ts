const prepareValue = (value: string): string => value.toLowerCase().replace(' ', '');

export function matchSearchValue(searchValue: string, value: string): boolean {
  return prepareValue(value).includes(prepareValue(searchValue));
}
