// @ts-nocheck

import { it } from '@framework';

const x = 1;
const y = 2;

it('increments', async () => {
  const screen = render(<Counter start={0} />);
  const count = screen.getByText('Count: 0');

  const increment = screen.getByRole('button', { name: /Inc/ });
  expect(count.innerText).equals('Count: 3');

  //#region conditionals
  if (true) {
    const x = 1;
  } else {
    const y = 1;
  }

  if (true) f();

  if (true) f();
  else f();

  true ? f() : f();

  //#region cycles
  for (let i = 0; i < 3; i++) await userEvent.click(increment);

  for (let i = 0; i < 3; i++) {
    await userEvent.click(increment);
  }

  while (conidition) await f();
  while (conidition) {
    await f();
  }

  // also for-in, for-of, do-while
});
