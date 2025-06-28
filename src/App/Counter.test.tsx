import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';
import { expect, it } from 'vitest';

it('shows initial state', () => {
  render(<Counter start={4} />);

  const count = screen.getByText('Count: 4');

  expect(count).toBeInTheDocument();
});
