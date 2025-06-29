import * as babel from '@babel/core';
import fs from 'fs/promises';
import path from 'path';
import { expect, it } from 'vitest';
import * as prettier from 'prettier';
import bodyDuplicatorPlugin from './babel/bodyDuplicator';
import generatorTransformPlugin from './babel/generatorTransform';
import browserTestsBabelPlugin from './babel';

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

it('duplicates method code', async () => {
  const input = await readTsx('./fixtures/bodyDuplicator/input.fixture.tsx');
  const output = await readTsx('./fixtures/bodyDuplicator/output.fixture.tsx');

  const transformed = await babel.transformAsync(input, {
    filename: 'fixture.tsx',
    presets: ['@babel/preset-typescript'],
    plugins: [bodyDuplicatorPlugin],
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

it('convert async function to async generator', async () => {
  const input = await readTsx('./fixtures/generatorTransform/input.fixture.tsx');
  // const output = await readTsx('./fixtures/generatorTransform/output.fixture.tsx');

  const transformed = await babel.transformAsync(input, {
    filename: 'fixture.tsx',
    presets: ['@babel/preset-typescript'],
    plugins: [generatorTransformPlugin],
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
