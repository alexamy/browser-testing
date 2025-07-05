import * as babel from '@babel/core';
import { type Plugin } from 'vite';
import browserTestsBabelPlugin from './babelBrowserTestsPlugin';

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
      // Check if file matches our pattern
      if (!includes.test(id) || id.includes('node_modules')) {
        return null;
      }

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

      return {
        code: result.code,
        map: result.map,
      };
    },
  };
}
