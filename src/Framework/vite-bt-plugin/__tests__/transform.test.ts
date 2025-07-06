import { expect, it, vi } from 'vitest';
import { readTsx, transformCode } from './helper.ts';

// Mock crypto at the top level
vi.mock('node:crypto', () => {
  return {
    default: {
      createHash: vi.fn(() => ({
        update: vi.fn().mockReturnThis(),
        digest: vi.fn(() => '6b851eb851eb'),
      })),
    },
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
