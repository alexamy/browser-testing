import { bodyDuplicator } from './bodyDuplicator';
import { generatorTransform } from './generatorTransform';

export default function () {
  return {
    name: 'Browser tests plugin',
    visitor: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      CallExpression(path: any) {
        generatorTransform(path);
        bodyDuplicator(path);
      },
    },
  };
}
