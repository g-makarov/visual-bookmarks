import { MIN_FAVICON_SIZE } from '~/constants';

export function preloadImage(url: string): Promise<'error' | 'ready' | 'idle'> {
  return new Promise(resolve => {
    const img = new Image();
    img.src = url;

    img.addEventListener('load', () => {
      if (img.naturalWidth < MIN_FAVICON_SIZE) {
        resolve('error');
      } else {
        resolve('ready');
      }
    });

    img.addEventListener('error', () => {
      resolve('error');
    });
  });
}
