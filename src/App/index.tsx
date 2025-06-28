import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { assert } from 'chai';
import { useEffect } from 'react';
import { Counter } from './Counter';

export function App() {
  useEffect(() => {
    async function test() {
      await new Promise((r) => setTimeout(r, 0)); // React "Should not already be working"

      const screen = render(<Counter start={0} />);
      const count = screen.getByText('Count: 0');

      const increment = screen.getByRole('button', { name: /Inc/ });
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
