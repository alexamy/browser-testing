import { useEffect, useState } from 'react';

export function Counter({ start }: { start: number }) {
  const [count, setCount] = useState(start);

  useEffect(() => setCount(start), [start]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
