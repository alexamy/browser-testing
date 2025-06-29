import { render as renderRtl } from '@testing-library/react';
import userEventDefault from '@testing-library/user-event';

//#region types
export interface TestOptions {
  dummy?: void;
}

export type TestMethod = (opts: TestOptions) => Promise<void>;

export interface TestInstance {
  description: string;
  test: TestMethod;
}

export interface MakeTestSuiteOptions {
  mountId: string;
}

export interface RunTestOptions {
  log(...args: unknown[]): void;
}

//#region tests
export async function runTest({ description, test }: TestInstance, { log }: RunTestOptions) {
  // Run test and catch assert and other errors
  try {
    log(`Running test: ${description}`);
    await test({});
  } catch (e) {
    log('Test error', e);
  } finally {
    log('Completed!');
  }
}

export const tests: TestInstance[] = [];

export function it(description: string, test: TestMethod) {
  const instance = { description, test };
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
