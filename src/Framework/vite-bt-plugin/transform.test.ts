import { expect, it, vi } from 'vitest';
import { readTsx, transformCode } from './test.helper.ts';

vi.mock(import('./babel/randomId.ts'), async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    getRandomId: vi.fn(() => '6b851eb851eb84'),
  };
});

it('transforms all language features properly', async () => {
  const fixturePath = './fixtures/generatorTransform.fixture.tsx';
  const input = await readTsx(fixturePath);
  const output = await transformCode(input);

  expect(output).toMatchSnapshot();
});

it('remove extra indentations for inner blocks', async () => {
  const fixturePath = './fixtures/indentation.fixture.tsx';
  const input = await readTsx(fixturePath);
  const output = await transformCode(input);

  expect(output).toMatchSnapshot();
});

it('runs plugin in proper order', async () => {
  const input = await readTsx('./fixtures/pluginOrder/input.fixture.tsx');
  const output = await readTsx('./fixtures/pluginOrder/output.fixture.tsx');

  const transformed = await transformCode(input);

  expect(transformed).toEqual(output);
});
