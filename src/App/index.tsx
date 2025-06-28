import { Counter } from './Counter';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { assert } from 'chai';

export function App() {
  useEffect(() => {
    async function test() {
      const count = screen.getByText('Count: 0');
      const increment = screen.getByText('Inc');
      await userEvent.click(increment);

      assert.equal(count.innerText, 'Count: 2');
    }

    test();
  }, []);

  return (
    <div>
      <Counter start={0} />
    </div>
  );
}
