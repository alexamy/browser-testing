import { expect, it } from 'vitest';
import { transformIt } from './transform';
import fs from 'fs/promises';
import path from 'path';

async function readTsx(filePath: string) {
  const resolvedFilePath = path.join(import.meta.dirname, filePath);
  const text = await fs.readFile(resolvedFilePath, 'utf-8');
  const lines = text.split('\n').slice(2).join('\n');

  return lines;
}

it('transforms code', async () => {
  const input = await readTsx('./input.fixture.tsx');
  const output = await readTsx('./output.fixture.tsx');

  const result = transformIt(input);

  expect(result).toEqual(output);
});
