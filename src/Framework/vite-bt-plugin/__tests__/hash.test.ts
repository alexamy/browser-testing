import { expect, it } from 'vitest';
import { readTsx, transformCode } from './helper.ts';

it('calculates persistent hash based on test source code, excluding extra indentation', async () => {
  const fixturePath = './fixtures/hash.fixture.tsx';
  const input = await readTsx(fixturePath);
  const output = await transformCode(input);

  expect(output).toMatchSnapshot();
});
