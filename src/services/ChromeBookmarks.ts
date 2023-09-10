import { bookmarksMock } from '~/services/mock';
import { matchSearchValue } from '~/utils/matchSearchValue';

export class ChromeBookmarks {
  static async createFolderIfNotExist(title: string): Promise<chrome.bookmarks.BookmarkTreeNode> {
    const foundFolder = await ChromeBookmarks.searchBookmarks({ title }).then(result =>
      result.filter(item => !item.url),
    );
    return foundFolder.length > 0 ? foundFolder[0] : chrome.bookmarks.create({ title });
  }

  static getChildren(id: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    return new Promise(resolve => {
      chrome.bookmarks.getChildren(id, resolve);
    });
  }

  static searchBookmarks(
    query: chrome.bookmarks.BookmarkSearchQuery,
  ): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    return new Promise(resolve => {
      if (process.env.NODE_ENV === 'development') {
        const findNodes = (
          nodes: chrome.bookmarks.BookmarkTreeNode[],
        ): chrome.bookmarks.BookmarkTreeNode[] => {
          const foo = nodes.filter(node =>
            matchSearchValue(query.query ?? '', `${node.title}${node.url}`),
          );
          const children = nodes.flatMap(node => node.children ?? []);
          const bar = children.length > 0 ? findNodes(children) : [];
          return foo.concat(bar);
        };
        resolve(findNodes(bookmarksMock));
      } else {
        chrome.bookmarks.search(query, resolve);
      }
    });
  }

  static getTree(): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    return new Promise(resolve => {
      if (process.env.NODE_ENV === 'development') {
        resolve(bookmarksMock);
      } else {
        chrome.bookmarks.getTree(([res]) => resolve(res.children ? res.children : []));
      }
    });
  }

  static getSubTree(id: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
    return new Promise(resolve => {
      chrome.bookmarks.getSubTree(id, resolve);
    });
  }

  static isFolder(obj: chrome.bookmarks.BookmarkTreeNode): boolean {
    return !obj.url;
  }

  static isBookmark(
    obj: chrome.bookmarks.BookmarkTreeNode,
  ): obj is chrome.bookmarks.BookmarkTreeNode & { url: string } {
    return !!obj.url;
  }

  static async create(
    bookmark: chrome.bookmarks.BookmarkCreateArg,
  ): Promise<chrome.bookmarks.BookmarkTreeNode> {
    return new Promise(resolve => {
      chrome.bookmarks.create(bookmark, resolve);
    });
  }
}
