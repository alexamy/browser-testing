import * as babel from '@babel/core';
import { type Plugin } from 'vite';
import browserTestsBabelPlugin from '../babel';

interface PluginOptions {
  includes?: RegExp;
}

export function browserTestsPlugin({
  includes = /\.bt\.(ts|tsx|js|jsx)$/,
}: PluginOptions = {}): Plugin {
  return {
    name: 'babel-transform-bs-test-files',
    enforce: 'pre',
    async transform(code, id) {
      console.log(id);

      // Check if file matches our pattern
      if (!includes.test(id) || id.includes('node_modules')) {
        return null;
      }

      console.log(id);

      // Transform
      const result = await babel.transformAsync(code, {
        filename: id,
        presets: ['@babel/preset-typescript'],
        plugins: [browserTestsBabelPlugin],
        generatorOpts: {
          retainLines: true,
        },
      });

      if (!result?.code) {
        throw new Error(`Babel transform failed for ${id}`);
      }

      // debug
      if (id.endsWith('Counter.bt.tsx')) {
        console.log('\n\n\n', id, code, '\n\n\n', result.code, '\n\n\n');
      }

      return {
        code: result.code,
        map: result.map,
      };
    },
  };
}
