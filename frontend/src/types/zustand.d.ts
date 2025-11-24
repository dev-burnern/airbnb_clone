declare module 'zustand' {
  // Minimal ambient declarations to satisfy TypeScript in this repo.
  export function create<TState = any>(fn: any): any;
  const _default: typeof create;
  export default _default;
}
