import * as babel from '@babel/core';
import browserTestsBabelPlugin from './babelBrowserTestsPlugin';

export async function transform(code: string, filename: string) {
  const result = await babel.transformAsync(code, {
    filename,
    presets: ['@babel/preset-typescript'],
    plugins: [browserTestsBabelPlugin],
    generatorOpts: {
      retainLines: true,
    },
  });

  return result;
}
