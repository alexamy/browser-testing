import userEvent from '@testing-library/user-event';
import { assert } from 'chai';
import { useEffect } from 'react';
import { Counter } from './Counter';
import { makeTestSuite, render, runTests, TEST_ROOT_ID } from './framework';

//#region tests
const { tests, it } = makeTestSuite();

it('increments', async () => {
  const screen = render(<Counter start={0} />);
  const count = screen.getByText('Count: 0');

  const increment = screen.getByRole('button', { name: /Inc/ });
  await userEvent.click(increment);

  assert.equal(count.innerText, 'Count: 1');
});

it('decrements', async () => {
  const screen = render(<Counter start={5} />);
  const count = screen.getByText('Count: 5');

  const increment = screen.getByText('Dec');
  await userEvent.click(increment);

  assert.equal(count.innerText, 'Count: 4');
});

//#region framework
export function App() {
  useEffect(() => {
    // React "Should not already be working" hack
    const delay = new Promise((r) => setTimeout(r, 0));
    delay.then(() => runTests(tests));
  }, []);

  return (
    <>
      Test runner ui
      <div id={TEST_ROOT_ID}></div>
      Footer
    </>
  );
}
