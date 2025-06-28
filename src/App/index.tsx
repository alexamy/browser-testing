import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { assert } from 'chai';
import { useEffect } from 'react';
import { Counter } from './Counter';

interface TestOptions {
  root: HTMLElement;
}

type TestMethod = (opts: TestOptions) => Promise<void>;

interface TestInstance {
  description: string;
  test: TestMethod;
}

async function runTest({ description, test }: TestInstance) {
  // React "Should not already be working" hack
  await new Promise((r) => setTimeout(r, 0));

  // Find the test root element
  const root = document.getElementById('test-root');
  if (!root) {
    throw new Error('Test root is not found');
  }

  // Run test and catch assert and other errors
  try {
    console.log(`Running test: ${description}`);
    await test({ root });
  } catch (e) {
    console.error('Test error', e);
  } finally {
    console.log('Finished');
    cleanup();
  }
}

function makeSuite() {
  const tests: TestInstance[] = [];

  function it(description: string, test: TestMethod) {
    const instance = { description, test };
    tests.push(instance);
  }

  async function runTests() {
    for (const test of tests) {
      await runTest(test);
    }
  }

  return { tests, runTests, it };
}

const { runTests, it } = makeSuite();

it('Count is incremented', async ({ root }: TestOptions) => {
  const screen = render(<Counter start={0} />, { container: root });
  const count = screen.getByText('Count: 0');

  const increment = screen.getByRole('button', { name: /Inc/ });
  await userEvent.click(increment);

  assert.equal(count.innerText, 'Count: 1');
});

export function App() {
  useEffect(() => {
    runTests();
  }, []);

  return (
    <>
      <div id="test-root"></div>
      Test runner ui
    </>
  );
}
