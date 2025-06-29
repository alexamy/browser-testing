import { types as t } from '@babel/core';

// Transform second argument of `it` from async function to async generator,
// yielding line number for each statement.
export default function generatorTransformPlugin() {
  return {
    name: 'test function generator',
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
  if (!isProperMethod) return;

  // Check function body
  const funcBody = secondArg.body;
  if (!funcBody.loc) {
    throw new Error('No function body line of code property found.');
  }

  if (!t.isBlockStatement(funcBody)) {
    throw new Error('Function body must be the block statement.');
  }

  // Append yield for each body element
  const start = funcBody.loc.start.line;
  addYields(funcBody, start);

  // Change function to a async generator
  const generatorFunction = t.functionExpression(
    t.identifier('test'), // function name
    secondArg.params, // keep same parameters
    funcBody, // body
    true, // generator: true
    true // async: true
  );

  // Replace the arrow function with the generator function
  path.node.arguments[1] = generatorFunction;
}

function addYields(block: t.BlockStatement, startLine: number) {
  const newBody: t.Statement[] = [];

  for (let i = 0; i < block.body.length; i++) {
    // Find expression
    const expression = block.body[i];
    if (!expression.loc) continue;

    // Add yield and original expression
    const line = expression.loc.start.line - startLine - 1;
    const yieldExpression = t.yieldExpression(t.numericLiteral(line));
    const yieldStatement = t.expressionStatement(yieldExpression);
    newBody.push(yieldStatement, expression);

    // Process control structures
    if (t.isForStatement(expression) && expression.body) {
      if (t.isBlockStatement(expression.body) && expression.body.body) {
        addYields(expression.body, startLine);
      }
    } else if (t.isIfStatement(expression)) {
      if (t.isBlockStatement(expression.consequent)) {
        addYields(expression.consequent, startLine);
      }
      if (t.isBlockStatement(expression.alternate)) {
        addYields(expression.alternate, startLine);
      }
    }
  }

  block.body = newBody;
}
