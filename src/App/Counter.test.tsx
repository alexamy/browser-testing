import { render } from 'vitest-browser-react';
import { Counter } from './Counter';
import { expect, it } from 'vitest';

it('shows initial state', async () => {
  const screen = render(<Counter start={4} />);

  const count = screen.getByText('Count: 4');
  await expect.element(count).toBeInTheDocument();
});

it('increments', async () => {
  const screen = render(<Counter start={0} />);

  const increment = screen.getByRole('button', { name: /Inc/ });
  await increment.click();

  const count = screen.getByText('Count: 1');
  await expect.element(count).toBeInTheDocument();
});

it('decrements', async () => {
  const screen = render(<Counter start={5} />);

  const decrement = screen.getByRole('button', { name: /Dec/ });
  await decrement.click();

  const count = screen.getByText('Count: 4');
  await expect.element(count).toBeInTheDocument();
});

it('can be only positive', async () => {
  const screen = render(<Counter start={0} />);

  const decrement = screen.getByRole('button', { name: /Dec/ });
  await decrement.click();

  const count = screen.getByText('Count: 0');
  await expect.element(count).toBeInTheDocument();
});

it('decrement is disabled at 0', async () => {
  const screen = render(<Counter start={0} />);

  const decrement = screen.getByRole('button', { name: /Dec/ });
  await expect.element(decrement).toBeDisabled();
});
