import { expect, it } from 'vitest';
import { transformIt } from './transform';

const input = `
import { it } from '@framework';

const x = 1;
const y = 2;

it('increments', async () => {
  const screen = render(<Counter start={0} />);
  const count = screen.getByText('Count: 0');

  const increment = screen.getByRole('button', { name: /Inc/ });

  for(let i = 0; i < 3; i++) {
    await userEvent.click(increment);
  }

  expect(count.innerText).equals('Count: 3');
});
`.trim();

const output = `
import { it } from '@framework';

const x = 1;
const y = 2;

it('increments', async function* test() {
  yield 0;
  const screen = render(<Counter start={0} />);

  yield 1;
  const count = screen.getByText('Count: 0');

  yield 3;
  const increment = screen.getByRole('button', { name: /Inc/ });

  yield 5;
  for(let i = 0; i < 3; i++) {
    yield 6;
    await userEvent.click(increment);
  }

  yield 9;
  expect(count.innerText).equals('Count: 3');
}, [
\`const screen = render(<Counter start={0} />);\`,
\`const count = screen.getByText('Count: 0');\`,
\`\`,
\`const increment = screen.getByRole('button', { name: /Inc/ });\`,
\`\`,
\`for(let i = 0; i < 3; i++) {\`,
\`  await userEvent.click(increment);\`,
\`}\`,
\`\`,
\`expect(count.innerText).equals('Count: 3');\`,
]);
`.trim();

it('transforms code', () => {
  const result = transformIt(input);

  expect(result).toEqual(output);
});
