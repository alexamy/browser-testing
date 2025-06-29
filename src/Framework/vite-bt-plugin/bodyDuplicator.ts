import { types as t } from '@babel/core';

// Duplicate the `it` second argument function body
// to array of strings, provided as a third argument to `it` call.
export default function () {
  return {
    name: 'test body duplicator',
    visitor: {
      CallExpression: bodyDuplicator,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bodyDuplicator(path: any) {
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
  const end = funcBody.loc.end.line;

  // Get code for line numbers
  const sourceCode = path.hub.file.code as string;
  const sourceLines = sourceCode.split('\n');
  const codeLines = sourceLines.slice(start, end - 1);
  const codeLinesIndent = codeLines.map((line) => line.replace(/^\s{2}/, ''));

  // Add the line contents array as the third argument
  const stringLiterals = codeLinesIndent.map((line) => t.stringLiteral(line));
  const lineContentsArray = t.arrayExpression(stringLiterals);
  path.node.arguments.push(lineContentsArray);
}
