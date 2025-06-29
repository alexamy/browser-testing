import * as babel from '@babel/core';
import { type Plugin } from 'vite';
import bodyDuplicatorPlugin from '../babel/bodyDuplicator';
import generatorTransformPlugin from '../babel/generatorTransform';

interface PluginOptions {
  includes?: RegExp;
}

export function browserTestsPlugin({
  includes = /\.bs\.(ts|tsx|js|jsx)$/,
}: PluginOptions = {}): Plugin {
  return {
    name: 'babel-transform-bs-test-files',
    async transform(code, id) {
      // Check if file matches our pattern
      if (!includes.test(id)) {
        return null;
      }

      // Transform
      const result = await babel.transformAsync(code, {
        filename: id,
        presets: ['@babel/preset-typescript'],
        plugins: [bodyDuplicatorPlugin, generatorTransformPlugin],
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
