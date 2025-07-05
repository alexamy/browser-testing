import * as babel from '@babel/core';
import fs from 'fs/promises';
import path from 'path';
import { expect, it, vi } from 'vitest';
import * as prettier from 'prettier';
import browserTestsBabelPlugin from './babel';

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

// Format code with prettier to allow better DX with fixtures
async function formatCode(code: string) {
  const formatted = await prettier.format(code, {
    parser: 'babel',
    singleQuote: true,
    trailingComma: 'es5',
  });

  const withLastNewline = formatted.replace(/\n$/, '');

  return withLastNewline;
}

it('transforms all language features properly', async () => {
  const input = await readTsx('./fixtures/generatorTransform.fixture.tsx');

  const transformed = await babel.transformAsync(input, {
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

  const formatted = await formatCode(transformed.code);

  expect(formatted).toMatchSnapshot();
});

it('runs plugin in proper order', async () => {
  const input = await readTsx('./fixtures/pluginOrder/input.fixture.tsx');
  const output = await readTsx('./fixtures/pluginOrder/output.fixture.tsx');

  const transformed = await babel.transformAsync(input, {
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

  const formatted = await formatCode(transformed.code);

  expect(formatted).toEqual(output);
});

it('process inner blocks', async () => {
  const input = await readTsx('./fixtures/indentation.fixture.tsx');

  const transformed = await babel.transformAsync(input, {
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

  const formatted = await formatCode(transformed.code);

  expect(formatted).toMatchSnapshot();
});
