import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { Counter } from './Counter';
import { makeTestSuite } from '../Framework';

const { runTests, it, render } = makeTestSuite({
  mountId: 'test-root',
});

export { runTests };

it('increments', async () => {
  const screen = render(<Counter start={0} />);
  const count = screen.getByText('Count: 0');

  const increment = screen.getByRole('button', { name: /Inc/ });
  await userEvent.click(increment);

  expect(count.innerText).equals('Count: 1');
});

it('decrements', async () => {
  const screen = render(<Counter start={5} />);
  const count = screen.getByText('Count: 5');

  const increment = screen.getByText('Dec');
  await userEvent.click(increment);

  expect(count.innerText).equals('Count: 4');
});
