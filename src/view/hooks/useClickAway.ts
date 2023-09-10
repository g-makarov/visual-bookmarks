import { RefObject, useEffect, useRef } from 'react';

const defaultEvents = ['mousedown', 'touchstart'];

interface UseClickAwayOptions {
  events?: string[];
  excludeElements?: HTMLElement[];
}

export function useClickAway(
  ref: RefObject<HTMLElement | null>,
  onClickAway: (event: Event) => void,
  options: UseClickAwayOptions = {},
): void {
  const { events = defaultEvents, excludeElements = [] } = options;
  const savedCallback = useRef(onClickAway);

  useEffect(() => {
    savedCallback.current = onClickAway;
  }, [onClickAway]);

  useEffect(() => {
    function handler(event: Event): void {
      const el = ref.current;
      const isExcludeElement = excludeElements.some(excludeElement =>
        excludeElement.contains(event.target as Node),
      );
      if (el && !el.contains(event.target as Node) && !isExcludeElement) {
        savedCallback.current(event);
      }
    }

    events.forEach(eventName => {
      document.addEventListener(eventName, handler);
    });

    return () => {
      events.forEach(eventName => {
        document.removeEventListener(eventName, handler);
      });
    };
  }, [events, excludeElements, ref]);
}
