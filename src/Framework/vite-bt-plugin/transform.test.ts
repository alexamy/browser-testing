import * as babel from '@babel/core';
import fs from 'fs/promises';
import path from 'path';
import { expect, it, vi } from 'vitest';
import * as prettier from 'prettier';
import browserTestsBabelPlugin from './babelBrowserTestsPlugin.ts';

vi.mock(import('./babel/randomId.ts'), async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    getRandomId: vi.fn(() => '6b851eb851eb84'),
  };
});

// Read tsx and remove `@ts-nocheck` directive
async function readTsx(filePath: string) {
  const resolvedFilePath = path.join(import.meta.dirname, filePath);
  const text = await fs.readFile(resolvedFilePath, 'utf-8');
  const lines = text.split('\n').slice(2).join('\n').trim();

  return lines;
}

/** Transforms code with babel and format with prettier. */
async function transformCode(code: string) {
  // babel
  const transformed = await babel.transformAsync(code, {
    filename: 'fixture.tsx',
    presets: ['@babel/preset-typescript'],
    plugins: [browserTestsBabelPlugin],
    generatorOpts: {
      retainLines: true,
    },
  });

  if (!transformed || !transformed.code) {
    throw new Error('Failed to transform code by Babel.');
  }

  // prettier
  const formatted = await prettier.format(transformed.code, {
    parser: 'babel',
    singleQuote: true,
    trailingComma: 'es5',
  });

  const withLastNewline = formatted.replace(/\n$/, '');

  return withLastNewline;
}

it('transforms all language features properly', async () => {
  const fixturePath = './fixtures/generatorTransform.fixture.tsx';
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

it('remove extra indentations for inner blocks', async () => {
  const fixturePath = './fixtures/indentation.fixture.tsx';
  const input = await readTsx(fixturePath);
  const output = await transformCode(input);

  expect(output).toMatchSnapshot();
});
