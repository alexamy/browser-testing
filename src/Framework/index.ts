import { render as renderRtl } from '@testing-library/react';
import userEventDefault from '@testing-library/user-event';

//#region types
export interface TestOptions {
  dummy?: void;
}

export type TestUserMethod = (opts: TestOptions) => Promise<void>;
export type TestMethod = (opts: TestOptions) => AsyncGenerator<number, void, unknown>;

export interface TestInstance {
  description: string;
  test: TestMethod;
  lines: string[];
}

export interface MakeTestSuiteOptions {
  mountId: string;
}

export interface RunTestOptions {
  log(...args: unknown[]): void;
  setLine(line: number): void;
}

//#region tests
export async function runTest(
  { description, test }: TestInstance,
  { log, setLine }: RunTestOptions
) {
  // Run test and catch assert and other errors
  try {
    log(`Running test: ${description}`);
    for await (const line of test({})) {
      setLine(line);
      await new Promise((r) => setTimeout(r, 300)); // DEBUG delay
    }
  } catch (e) {
    log('Test error', e);
  } finally {
    log('Completed!');
  }
}

export const tests: TestInstance[] = [];

function convertTestWithVitestPlugin(test: TestUserMethod): TestMethod {
  if (test.constructor.name !== 'AsyncGeneratorFunction') {
    throw new Error(
      'Found malformed test body. Check that Vite plugin is enabled and transpiles bt tests correctly.'
    );
  }

  return test as unknown as TestMethod;
}

export function it(description: string, test: TestUserMethod, lines: string[] = []) {
  const instance = { description, lines, test: convertTestWithVitestPlugin(test) };
  tests.push(instance);
}

//#region testing library
export const TESTS_MOUNT_ID = 'test-root';

export function render(
  ...[markup, options]: Parameters<typeof renderRtl>
): ReturnType<typeof renderRtl> {
  // Find the test root element
  const root = document.getElementById(TESTS_MOUNT_ID);
  if (!root) {
    throw new Error('Test root is not found');
  }

  // Render on test root element
  const result = renderRtl(markup, { ...options, container: root });

  return result;
}

export const userEvent = userEventDefault;
