import { render as renderRtl } from '@testing-library/react';

//#region runner
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

export async function runTest({ description, test }: TestInstance, { log }: RunTestOptions) {
  // Run test and catch assert and other errors
  try {
    log(`Running test:\n${description}`);
    await test({});
  } catch (e) {
    log('Test error', e);
  } finally {
    log('Completed!');
  }
}

function makeRender(mountId: string) {
  return function render(
    ...[markup, options]: Parameters<typeof renderRtl>
  ): ReturnType<typeof renderRtl> {
    // Find the test root element
    const root = document.getElementById(mountId);
    if (!root) {
      throw new Error('Test root is not found');
    }

    // Render on test root element
    const result = renderRtl(markup, { ...options, container: root });

    return result;
  };
}

export function makeTestSuite({ mountId }: MakeTestSuiteOptions) {
  const tests: TestInstance[] = [];

  const render = makeRender(mountId);

  function it(description: string, test: TestMethod) {
    const instance = { description, test };
    tests.push(instance);
  }

  return { tests, render, it };
}
