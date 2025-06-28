import { render as renderRtl, cleanup } from '@testing-library/react';

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

export async function runTest({ description, test }: TestInstance) {
  // Run test and catch assert and other errors
  try {
    console.log(`Running test:\n${description}`);
    await test({});
  } catch (e) {
    console.error('Test error', e);
  } finally {
    console.log('Completed!');
    cleanup();
  }
}

function makeRunTests(tests: TestInstance[]) {
  return async function runTests() {
    for (const test of tests) {
      await runTest(test);
    }
  };
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

  const runTests = makeRunTests(tests);
  const render = makeRender(mountId);

  function it(description: string, test: TestMethod) {
    const instance = { description, test };
    tests.push(instance);
  }

  return { tests, runTests, render, it };
}
