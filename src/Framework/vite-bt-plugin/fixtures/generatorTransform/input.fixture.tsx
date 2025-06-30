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

  // also for-in, for-of, do-while are implemented in transform logic

  //#region switch
  switch (x) {
    case 1:
      await userEvent.click(increment);
      break;
    default:
      await userEvent.click(increment);
      if (condition) {
        console.log('');
      }
      break;
  }

  // simple block
  {
    const x = 1;
    x += 1;
  }

  // Exceptions
  try {
    const x = 1;
  } catch {
    const y = 1;
  } finally {
    const z = 1;
  }
});
