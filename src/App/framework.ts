import { render as renderRtl, cleanup } from '@testing-library/react';

//#region runner
interface TestOptions {
  dummy?: void;
}

type TestMethod = (opts: TestOptions) => Promise<void>;

interface TestInstance {
  description: string;
  test: TestMethod;
}

export const TEST_ROOT_ID = 'test-root';

export function render(
  ...[markup, options]: Parameters<typeof renderRtl>
): ReturnType<typeof renderRtl> {
  // Find the test root element
  const root = document.getElementById(TEST_ROOT_ID);
  if (!root) {
    throw new Error('Test root is not found');
  }

  // Render on test root element
  const result = renderRtl(markup, { ...options, container: root });

  return result;
}

async function runTest({ description, test }: TestInstance) {
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

export async function runTests(tests: TestInstance[]) {
  for (const test of tests) {
    await runTest(test);
  }
}

export function makeTestSuite() {
  const tests: TestInstance[] = [];

  function it(description: string, test: TestMethod) {
    const instance = { description, test };
    tests.push(instance);
  }

  return { tests, it };
}
