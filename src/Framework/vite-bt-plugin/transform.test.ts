import * as babel from '@babel/core';
import fs from 'fs/promises';
import path from 'path';
import { expect, it } from 'vitest';
import bodyDuplicatorPlugin from './babel/bodyDuplicator';
import generatorTransformPlugin from './babel/generatorTransform';

async function readTsx(filePath: string) {
  const resolvedFilePath = path.join(import.meta.dirname, filePath);
  const text = await fs.readFile(resolvedFilePath, 'utf-8');
  const lines = text.split('\n').slice(2).join('\n').trim();

  return lines;
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

  expect(transformed.code).toEqual(output);
});

it('convert async function to async generator', async () => {
  const input = await readTsx('./fixtures/generatorTransform/input.fixture.tsx');
  const output = await readTsx('./fixtures/generatorTransform/output.fixture.tsx');

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

  expect(transformed.code).toEqual(output);
});
