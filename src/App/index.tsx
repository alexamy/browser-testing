import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { assert } from 'chai';
import { useEffect } from 'react';
import { Counter } from './Counter';

export function App() {
  useEffect(() => {
    async function test() {
      const count = screen.getByText('Count: 0');
      const increment = screen.getByText('Inc');
      await userEvent.click(increment);

      assert.equal(count.innerText, 'Count: 1');
    }

    test();
  }, []);

  return (
    <div>
      <Counter start={0} />
    </div>
  );
}
