import { useState } from 'react';
import s from './Counter.module.css';

export function Counter({ start }: { start: number }) {
  const [count, setCount] = useState(start);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(Math.max(0, count - 1));

  return (
    <div className={s.counter}>
      <p>Count: {count}</p>
      <div className={s.buttons}>
        <button onClick={increment}>+</button>
        <button onClick={decrement} disabled={count === 0}>
          −
        </button>
      </div>
    </div>
  );
}
