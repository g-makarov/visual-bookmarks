// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFunction<T extends (...args: any) => any>(arg: unknown): arg is T {
  return Object.prototype.toString.call(arg) === '[object Function]';
}
