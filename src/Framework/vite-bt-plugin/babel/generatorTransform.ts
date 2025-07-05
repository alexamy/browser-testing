import { types as t } from '@babel/core';

/**  Transform function to an async generator, yielding line number for each statement. */
export function generatorTransform(fn: t.ArrowFunctionExpression | t.FunctionExpression) {
  // Make a copy
  const funcBody = structuredClone(fn.body);

  // Check that function has loc info
  if (!funcBody.loc) {
    throw new Error('No function body line of code property found.');
  }

  // Check that function body is a block statement
  if (!t.isBlockStatement(funcBody)) {
    throw new Error('Function body must be the block statement.');
  }

  // Append yield for each body element
  const start = funcBody.loc.start.line;
  addYieldsAt(funcBody, start);

  // Change function to a async generator
  const generatorFunction = t.functionExpression(
    t.identifier('test'), // function name
    fn.params, // keep same parameters
    funcBody, // body
    true, // generator: true
    true // async: true
  );

  return generatorFunction;
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
