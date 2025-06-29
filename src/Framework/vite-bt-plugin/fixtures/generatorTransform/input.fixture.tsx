// @ts-nocheck

import { it } from '@framework';

const x = 1;
const y = 2;

it('increments', async () => {
  const screen = render(<Counter start={0} />);
  const count = screen.getByText('Count: 0');

  const increment = screen.getByRole('button', { name: /Inc/ });

  for (let i = 0; i < 3; i++) {
    await userEvent.click(increment);
  }

  expect(count.innerText).equals('Count: 3');

  for (let i = 0; i < 3; i++) await userEvent.click(increment);

  if (true) {
    const x = 1;
  } else {
    const y = 1;
  }
});
