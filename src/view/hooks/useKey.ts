import { useEffect } from 'react';

export function useKey(key: string | null, callback: (e: KeyboardEvent) => void): void {
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent): void {
      if (e.key === key) {
        callback(e);
      }
    }

    if (key === null) {
      return () => {
        document.removeEventListener('keydown', handleKeydown);
      };
    }

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [callback, key]);
}
