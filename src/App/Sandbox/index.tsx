import { type TestInstance } from '@framework/test';
import { useEffect, useState } from 'react';
import type { RunnerEvent, SandboxEvent } from '../ipc';
import { useTest, useTestsRegistry } from '@framework/react';

function useParent() {
  const [parent, setParent] = useState<Window>();

  useEffect(() => {
    if (window.parent === window) {
      console.warn('Sandbox is meant to be loaded in the iframe.');
    }

    setParent(window.parent);
  }, []);

  return parent;
}

function useMessageListener(test: ReturnType<typeof useTest>) {
  const tests = useTestsRegistry();

  useEffect(() => {
    function listener({ data }: MessageEvent<RunnerEvent>) {
      console.log('sandbox', data);

      if (data.type === 'select') {
        const instance = tests[data.testId];
        test.select(instance);
      } else if (data.type === 'start') {
        test.start();
      }
    }

    window.addEventListener('message', listener);

    return () => window.removeEventListener('message', listener);
  }, [test, tests]);
}

// Empty container to run tests
export function Sandbox() {
  const parent = useParent();
  const test = useTest();
  useMessageListener(test);

  useEffect(() => {
    parent?.postMessage({
      type: 'progress-changed',
      inProgress: test.inProgress,
    } satisfies SandboxEvent);
  }, [parent, test.inProgress]);

  return <></>;
}
