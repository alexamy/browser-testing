import { types as t } from '@babel/core';
import { generate } from '@babel/generator';
import { blockDuplicator } from './babel/blockDuplicator';
import { generatorTransform } from './babel/generatorTransform';
import crypto from 'node:crypto';

export default function () {
  return {
    name: 'Browser tests plugin',
    visitor: {
      CallExpression: callTransformer,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function callTransformer(path: any) {
  // Check if this is an 'it' call with exactly 2 arguments
  const isItCall = t.isIdentifier(path.node.callee, { name: 'it' });
  const hasTwoArguments = path.node.arguments.length === 2;
  const isTestFunction = isItCall && hasTwoArguments;
  if (!isTestFunction) return;

  // Check if the second argument is an async arrow function or function expression
  const testFn = path.node.arguments[1];
  const isFunction = t.isArrowFunctionExpression(testFn) || t.isFunctionExpression(testFn);
  if (!isFunction) return;

  // Check that function body is a block statement
  if (!t.isBlockStatement(testFn.body)) {
    throw new Error('Function body must be the block statement.');
  }

  // Get transformations
  const sourceCode = path.hub.file.code as string;
  const codeStrings = blockDuplicator(testFn.body, sourceCode);
  const generator = generatorTransform(testFn);

  // Make the random id
  const fnSourceCode = generate(path.node).code.replaceAll(/\s+/g, '');
  const hash = crypto.createHash('sha256').update(fnSourceCode).digest('hex').substring(0, 12);
  const hashLiteral = t.stringLiteral(hash);

  // Make object argument
  const extraArg = t.objectExpression([
    t.objectProperty(t.stringLiteral('id'), hashLiteral),
    t.objectProperty(t.stringLiteral('source'), codeStrings),
    t.objectProperty(t.stringLiteral('generator'), generator),
  ]);

  path.node.arguments.push(extraArg);
}
