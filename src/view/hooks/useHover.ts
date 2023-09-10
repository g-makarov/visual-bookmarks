import { MutableRefObject, useEffect, useRef, useState } from 'react';

export function useHover<T extends HTMLElement>(): [MutableRefObject<T | null>, boolean] {
  const [hovering, setHovering] = useState<boolean>(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;

    const handleMouseEnter = (): void => {
      setHovering(true);
    };

    const handleMouseLeave = (): void => {
      setHovering(false);
    };

    node?.addEventListener('mouseenter', handleMouseEnter);
    node?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node?.removeEventListener('mouseenter', handleMouseEnter);
      node?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return [ref, hovering];
}
