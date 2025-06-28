import { render as renderRtl, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { assert } from 'chai';
import { useEffect } from 'react';
import { Counter } from './Counter';

//#region runner
interface TestOptions {
  dummy?: void;
}

type TestMethod = (opts: TestOptions) => Promise<void>;

interface TestInstance {
  description: string;
  test: TestMethod;
}

const TEST_ROOT_ID = 'test-root';

function render(...[markup, options]: Parameters<typeof renderRtl>): ReturnType<typeof renderRtl> {
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

async function runTests(tests: TestInstance[]) {
  for (const test of tests) {
    await runTest(test);
  }
}

function makeTestSuite() {
  const tests: TestInstance[] = [];

  function it(description: string, test: TestMethod) {
    const instance = { description, test };
    tests.push(instance);
  }

  return { tests, it };
}

//#region tests
const { tests, it } = makeTestSuite();

it('increments', async () => {
  const screen = render(<Counter start={0} />);
  const count = screen.getByText('Count: 0');

  const increment = screen.getByRole('button', { name: /Inc/ });
  await userEvent.click(increment);

  assert.equal(count.innerText, 'Count: 1');
});

it('decrements', async () => {
  const screen = render(<Counter start={5} />);
  const count = screen.getByText('Count: 5');

  const increment = screen.getByText('Dec');
  await userEvent.click(increment);

  assert.equal(count.innerText, 'Count: 4');
});

//#region framework
export function App() {
  useEffect(() => {
    // React "Should not already be working" hack
    const delay = new Promise((r) => setTimeout(r, 0));
    delay.then(() => runTests(tests));
  }, []);

  return (
    <>
      Test runner ui
      <div id={TEST_ROOT_ID}></div>
      Footer
    </>
  );
}
