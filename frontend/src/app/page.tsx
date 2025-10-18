'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { increment, decrement, addBy, reset } from '@/features/counter/counterSlice';
import { fetchTodos, toggle, clear } from '@/features/todos/todosSlice';
import { useState } from 'react';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(s => s.counter.value);
  const { items, loading, error } = useAppSelector(s => s.todos);
  const [step, setStep] = useState(5);

  return (
    <main style={{ padding: 24 }}>
      <h1>Redux Toolkit 데모</h1>

      <section style={{ marginTop: 16 }}>
        <h2>Counter</h2>
        <p>value: {count}</p>
        <button onClick={() => dispatch(increment())}>+1</button>{' '}
        <button onClick={() => dispatch(decrement())}>-1</button>{' '}
        <input
          type="number"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          style={{ width: 80, marginLeft: 8 }}
        />
        <button onClick={() => dispatch(addBy(step))}>+ step</button>{' '}
        <button onClick={() => dispatch(reset())}>reset</button>
      </section>

      <hr style={{ margin: '24px 0' }} />

      <section>
        <h2>Todos (async)</h2>
        <button onClick={() => dispatch(fetchTodos())} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Todos'}
        </button>{' '}
        <button onClick={() => dispatch(clear())}>Clear</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
          {items.map(t => (
            <li key={t.id}>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => dispatch(toggle(t.id))}
                />{' '}
                {t.title}
              </label>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
