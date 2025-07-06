import { types as t } from '@babel/core';

/** Transform code block to an array of strings. */
export function blockDuplicator(codeBlock: t.BlockStatement, sourceCode: string) {
  // Get source code
  const codeLines = extractSourceCode(codeBlock, sourceCode);
  const codeLinesDeindent = removeExtraIndentation(codeLines);

  // Make expression
  const lineContentLiterals = codeLinesDeindent.map((line) => t.stringLiteral(line));
  const lineContentsArray = t.arrayExpression(lineContentLiterals);

  return lineContentsArray;
}

export function extractSourceCode(statement: t.Statement, sourceCode: string) {
  // Check that function has loc info
  if (!statement.loc) {
    throw new Error('No function body line of code property found.');
  }

  // Get line numbers of block
  const start = statement.loc.start.line;
  const end = statement.loc.end.line;

  // Get code for line numbers
  const sourceLines = sourceCode.split('\n');
  const codeLines = sourceLines.slice(start, end - 1);

  return codeLines;
}

export function removeExtraIndentation(codeLines: string[]) {
  const spaceRegex = / {0,}/;
  const nonEmptyLines = codeLines.filter((line) => line);
  const indentationLevels = nonEmptyLines.map((line) => line.match(spaceRegex)![0].length);
  const startIndentation = Math.min(...indentationLevels);
  const codeLinesDeindent = codeLines.map((line) => line.substring(startIndentation));

  return codeLinesDeindent;
}
