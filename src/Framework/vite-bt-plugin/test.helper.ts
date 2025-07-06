import fs from 'fs/promises';
import path from 'path';
import * as prettier from 'prettier';
import { transform } from './transform.ts';

// Read tsx and remove `@ts-nocheck` directive
export async function readTsx(filePath: string) {
  const resolvedFilePath = path.join(import.meta.dirname, filePath);
  const text = await fs.readFile(resolvedFilePath, 'utf-8');
  const lines = text.split('\n').slice(2).join('\n').trim();

  return lines;
}

/** Transforms code with babel and format with prettier. */
export async function transformCode(code: string) {
  // babel
  const transformed = await transform(code, 'fixture.tsx');

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
