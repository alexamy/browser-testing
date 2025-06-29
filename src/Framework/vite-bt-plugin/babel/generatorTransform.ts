import { types as t } from '@babel/core';

// Transform second argument of `it` from async function to async generator,
// yielding line number for each statement.
export default function generatorTransformPlugin() {
  return {
    name: 'test body duplicator',
    visitor: {
      CallExpression: generatorTransform,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generatorTransform(path: any) {
  // Check if this is an 'it' call with exactly 2 arguments
  const isItCall = t.isIdentifier(path.node.callee, { name: 'it' });
  const hasTwoArguments = path.node.arguments.length === 2;
  const isTestFunction = isItCall && hasTwoArguments;
  if (!isTestFunction) return;

  // Check if the second argument is an async arrow function or function expression
  const secondArg = path.node.arguments[1];
  const isFunction = t.isArrowFunctionExpression(secondArg) || t.isFunctionExpression(secondArg);
  const isProperMethod = isFunction && secondArg.async;
  if (!isProperMethod) {
    throw new Error('Expect async function with body as second argument to it.');
  }

  // Get line numbers of block
  const funcBody = secondArg.body;
  if (!funcBody.loc) {
    throw new Error('No function body line of code property found.');
  }

  const start = funcBody.loc.start.line;
}
