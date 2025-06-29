const bodyDuplicator = {
  name: 'body duplicator',
  visitor: {
    CallExpression(path) {
      // Check if this is an 'it' call with exactly 2 arguments
      const isItCall = t.isIdentifier(path.node.callee, { name: 'it' });
      const hasTwoArguments = path.node.arguments.length === 2;
      const isTestFunction = isItCall && hasTwoArguments;
      if (!isTestFunction) return;

      // Check if the second argument is an async arrow function or function expression
      const secondArg = path.node.arguments[1];
      const isFunction =
        t.isArrowFunctionExpression(secondArg) || t.isFunctionExpression(secondArg);
      const isProperMethod = isFunction && secondArg.async;
      if (!isProperMethod) return;

      // Get line numbers of block
      const funcBody = secondArg.body;
      const start = funcBody.loc.start.line;
      const end = funcBody.loc.end.line - 1;

      // Get code for line numbers
      const sourceCode = path.hub.file.code;
      const sourceLines = sourceCode.split('\n');
      const codeLines = sourceLines.slice(start, end);
      const codeLinesIndent = codeLines.map((line) => line.replace(/^\s{2}/, ''));

      // Add the line contents array as the third argument
      const stringLiterals = codeLinesIndent.map((line) => t.stringLiteral(line));
      const lineContentsArray = t.arrayExpression(stringLiterals);
      path.node.arguments.push(lineContentsArray);
    },
  },
};
