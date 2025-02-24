/**
 * Checks `arg` for plain object
 *
 * ~~~
 * isPlainObject({}) // true
 * isPlainObject(() => {}) // false
 * ~~~
 */

function isObject(arg: unknown): boolean {
  return Object.prototype.toString.call(arg) === '[object Object]';
}

export function isPlainObject(arg: any): arg is Record<string, unknown> {
  if (!isObject(arg)) {
    return false;
  }

  if (arg.constructor === undefined) {
    return true;
  }

  if (!isObject(arg.constructor.prototype)) {
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(arg.constructor.prototype, 'isPrototypeOf')) {
    return false;
  }

  return true;
}
