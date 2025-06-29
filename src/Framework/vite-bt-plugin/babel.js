const bodyDuplicator = {
  name: 'body duplicator',
  visitor: {
    CallExpression(path) {
      // Check if this is an 'it' call with exactly 2 arguments
      const isIt = t.isIdentifier(path.node.callee, { name: 'it' });
      const isTwoArguments = path.node.arguments.length === 2;
      if (!(isIt && isTwoArguments)) return;

      // Check if the second argument is an async arrow function or function expression
      const secondArg = path.node.arguments[1];
      const isFunction =
        t.isArrowFunctionExpression(secondArg) || t.isFunctionExpression(secondArg);
      if (!(isFunction && secondArg.async)) return;

      const functionBody = secondArg.body;
      const bodyStatements = functionBody.body;

      // Get the source code and extract line contents
      const sourceCode = path.hub.file.code;
      const sourceLines = sourceCode.split('\n');

      // Extract line contents from the function body statements
      const lineContents = bodyStatements
        .filter((statement) => statement.loc) // Only statements with location info
        .map((statement) => {
          const lineNumber = statement.loc.start.line;
          const lineContent = sourceLines[lineNumber - 1]; // Arrays are 0-indexed, line numbers are 1-indexed
          return lineContent ? lineContent.trim() : '';
        });

      // Create array expression with line contents
      const lineContentsArray = t.arrayExpression(
        lineContents.map((content) => t.stringLiteral(content))
      );

      // Add the line contents array as the third argument
      path.node.arguments.push(lineContentsArray);
    },
  },
};
