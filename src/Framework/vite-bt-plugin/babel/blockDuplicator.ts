import { types as t } from '@babel/core';

/** Transform code block to an array of strings. */
export function blockDuplicator(codeBlock: t.BlockStatement, sourceCode: string) {
  // Check that function has loc info
  if (!codeBlock.loc) {
    throw new Error('No function body line of code property found.');
  }

  // Get line numbers of block
  const start = codeBlock.loc.start.line;
  const end = codeBlock.loc.end.line;

  // Get code for line numbers
  const sourceLines = sourceCode.split('\n');
  const codeLines = sourceLines.slice(start, end - 1);

  // Remove extra indentation
  const spaceRegex = / {0,}/;
  const nonEmptyLines = codeLines.filter((line) => line);
  const indentationLevels = nonEmptyLines.map((line) => line.match(spaceRegex)![0].length);
  const startIndentation = Math.min(...indentationLevels);

  // Make the line contents array
  const codeLinesIndent = codeLines.map((line) => line.substring(startIndentation));
  const lineContentLiterals = codeLinesIndent.map((line) => t.stringLiteral(line));
  const lineContentsArray = t.arrayExpression(lineContentLiterals);

  return lineContentsArray;
}
