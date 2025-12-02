declare module 'zustand' {
  // Minimal ambient declarations to satisfy TypeScript in this repo.
  export interface StoreApi<TState> {
    setState: (partial: Partial<TState> | ((state: TState) => Partial<TState>), replace?: boolean) => void;
    getState: () => TState;
    subscribe: (listener: (state: TState, prevState: TState) => void) => () => void;
    destroy: () => void;
  }

  export type UseBoundStore<TState> = {
    (): TState;
    <U>(selector: (state: TState) => U): U;
  } & StoreApi<TState>;

  export function create<TState>(fn: (set: (partial: Partial<TState> | ((state: TState) => Partial<TState>)) => void, get: () => TState) => TState): UseBoundStore<TState>;
  const _default: typeof create;
  export default _default;
}
