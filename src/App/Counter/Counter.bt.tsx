import { expect } from 'chai';
import { render, it, userEvent } from '@framework/test';
import { Counter } from '.';

it('shows initial state', async () => {
  const screen = render(<Counter start={4} />);

  const count = screen.queryByText('Count: 4');

  expect(count).not.equal(null);
});

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

  const decrement = screen.getByRole('button', { name: /Dec/ });
  await userEvent.click(decrement);

  expect(count.innerText).equals('Count: 4');
});

it('can be only positive', async () => {
  const screen = render(<Counter start={0} />);

  const decrement = screen.getByRole('button', { name: /Dec/ });
  await userEvent.click(decrement);

  const count = screen.queryByText('Count: 0');
  expect(count).not.equal(null);
});

it('decrement is disabled at 0', async () => {
  const screen = render(<Counter start={0} />);

  const decrement = screen.getByRole('button', { name: /Dec/ }) as HTMLButtonElement;
  expect(decrement.disabled).equals(true);
});
