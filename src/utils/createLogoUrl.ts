export function createLogoUrl(url: string): string {
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=128`;
  // const match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/gim);
  // return match && match.length > 0 ? `https://logo.clearbit.com/${match[0]}/?size=320` : '';
}
