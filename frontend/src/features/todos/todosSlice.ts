import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type Todo = { id: number; title: string; completed: boolean };

export const fetchTodos = createAsyncThunk<Todo[]>(
  'todos/fetchTodos',
  async () => {
    // 데모용 공개 API
    const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
    if (!res.ok) throw new Error('Failed to fetch todos');
    return (await res.json()) as Todo[];
  }
);

type TodosState = {
  items: Todo[];
  loading: boolean;
  error: string | null;
};

const initialState: TodosState = { items: [], loading: false, error: null };

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    toggle(state, { payload }: { payload: number }) {
      const t = state.items.find(x => x.id === payload);
      if (t) t.completed = !t.completed;
    },
    clear(state) {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTodos.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export const { toggle, clear } = todosSlice.actions;
export default todosSlice.reducer;
