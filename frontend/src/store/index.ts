import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/features/counter/counterSlice';
import todosReducer from '@/features/todos/todosSlice';

// 필요 시 middleware 설정 확장 가능
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
  },
  // getDefaultMiddleware() 그대로 두면 thunk 포함됨
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
