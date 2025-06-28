import { useState } from 'react';

export function Counter({ start }: { start: number }) {
  const [count, setCount] = useState(start);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(Math.max(0, count - 1));

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement} disabled={count === 0}>
        -
      </button>
    </div>
  );
}
