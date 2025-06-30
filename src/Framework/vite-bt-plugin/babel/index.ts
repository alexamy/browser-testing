import { bodyDuplicator } from './bodyDuplicator';
import { generatorTransform } from './generatorTransform';

export default function () {
  return {
    name: 'Browser tests plugin',
    visitor: {
      CallExpression: {
        enter: generatorTransform,
        exit: bodyDuplicator,
      },
    },
  };
}
