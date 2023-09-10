declare module '*.css' {
  const styles: Record<string, string>;
  export default styles;
}

declare module '*.scss' {
  const styles: Record<string, string>;
  export default styles;
}

declare type Nullable<T> = T | null;
