import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';
import { afterEach, expect, it } from 'vitest';

afterEach(() => {
  document.body.innerHTML = '';
});

it('shows initial state', () => {
  render(<Counter start={4} />);

  const count = screen.getByText('Count: 4');

  expect(count).toBeInTheDocument();
});

it('increments', async () => {
  render(<Counter start={0} />);

  const increment = screen.getByText('+');
  await userEvent.click(increment);

  const count = screen.getByText('Count: 1');
  expect(count).toBeInTheDocument();
});

it('decrements', async () => {
  render(<Counter start={5} />);

  const increment = screen.getByText('-');
  await userEvent.click(increment);

  const count = screen.getByText('Count: 4');
  expect(count).toBeInTheDocument();
});

it('can be only positive', async () => {
  render(<Counter start={0} />);

  const decrement = screen.getByText('-');
  await userEvent.click(decrement);

  const count = screen.getByText('Count: 0');
  expect(count).toBeInTheDocument();
});

it('decrement is disabled at 0', async () => {
  render(<Counter start={0} />);

  const decrement = screen.getByText('-');
  expect(decrement).toBeDisabled();
});
