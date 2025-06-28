import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { assert } from 'chai';
import { useEffect } from 'react';
import { Counter } from './Counter';

async function test() {
  await new Promise((r) => setTimeout(r, 0)); // React "Should not already be working"

  const root = document.getElementById('test-root');
  if (!root) {
    throw new Error('Test root is not found');
  }

  const screen = render(<Counter start={0} />, { container: root });
  const count = screen.getByText('Count: 0');

  const increment = screen.getByRole('button', { name: /Inc/ });
  await userEvent.click(increment);

  assert.equal(count.innerText, 'Count: 1');
}

export function App() {
  useEffect(() => {
    test();
  }, []);

  return (
    <>
      <div id="test-root"></div>
      Text after
    </>
  );
}
