import { useCallback, useMemo, useState } from 'react';

interface UseSwitchValueReturn {
  value: boolean;
  on(): void;
  off(): void;
  toggle(): void;
}

export function useSwitchValue(initial: boolean): UseSwitchValueReturn {
  const [value, setValue] = useState(initial);

  const on = useCallback(() => {
    setValue(true);
  }, []);

  const off = useCallback(() => {
    setValue(false);
  }, []);

  const toggle = useCallback(() => {
    setValue(prevValue => !prevValue);
  }, []);

  return useMemo(() => ({ value, on, off, toggle, set: setValue }), [off, on, toggle, value]);
}
