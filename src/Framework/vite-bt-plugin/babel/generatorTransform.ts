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
export function generatorTransform(path: any) {
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
  addYieldsAt(funcBody, start);

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

function addYieldsAt(block: t.BlockStatement | t.SwitchCase, startLine: number) {
  addYields(block);

  function addYields(block: t.BlockStatement | t.SwitchCase) {
    const newBody: t.Statement[] = [];
    const oldBody = t.isSwitchCase(block) ? block.consequent : block.body;

    for (const expression of oldBody) {
      // Skip expression without line of code information
      if (!expression.loc) continue;

      // Append yield, except some blocks
      if (!t.isFunctionDeclaration(expression)) {
        const line = expression.loc.start.line - startLine - 1;
        const yieldExpression = t.yieldExpression(t.numericLiteral(line));
        const yieldStatement = t.expressionStatement(yieldExpression);
        newBody.push(yieldStatement);
      }

      // Append original expression
      newBody.push(expression);

      // Recursively call add yields for inner blocks
      iterateInnerBlocks(expression);
    }

    // Update block body
    if (t.isSwitchCase(block)) {
      block.consequent = newBody;
    } else {
      block.body = newBody;
    }
  }

  // Process control structures
  function iterateInnerBlocks(expression: t.Statement) {
    // Cycles
    if (
      t.isForStatement(expression) ||
      t.isForInStatement(expression) ||
      t.isForOfStatement(expression) ||
      t.isWhileStatement(expression) ||
      t.isDoWhileStatement(expression)
    ) {
      if (expression.body && t.isBlockStatement(expression.body) && expression.body.body) {
        addYields(expression.body);
      }
      // If
    } else if (t.isIfStatement(expression)) {
      if (t.isBlockStatement(expression.consequent)) {
        addYields(expression.consequent);
      }
      if (t.isBlockStatement(expression.alternate)) {
        addYields(expression.alternate);
      }
      // Switch
    } else if (t.isSwitchStatement(expression)) {
      expression.cases.forEach((caseClause) => {
        if (caseClause.consequent) {
          addYields(caseClause);
        }
      });
      // Simple block
    } else if (t.isBlockStatement(expression)) {
      addYields(expression);
      // Exceptions
    } else if (t.isTryStatement(expression)) {
      addYields(expression.block);
      if (expression.handler) addYields(expression.handler.body);
      if (expression.finalizer) addYields(expression.finalizer);
    }
  }
}
