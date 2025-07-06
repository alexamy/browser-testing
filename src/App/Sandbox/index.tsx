import { type TestInstance } from '@framework/test';
import { useEffect, useState } from 'react';
import type { RunnerEvent, SandboxEvent } from '../ipc';
import { useTestsRegistry } from '@framework/react';

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

// Empty container to run tests
export function Sandbox() {
  const tests = useTestsRegistry();
  const [current, setCurrent] = useState<TestInstance>();
  const [inProgress, setInProgress] = useState(false);
  const parent = useParent();

  useEffect(() => {
    function listener({ data }: MessageEvent<RunnerEvent>) {
      if (data.type === 'select-test') {
        setCurrent(tests[data.testId]);
      }
    }

    window.addEventListener('message', listener);

    return () => window.removeEventListener('message', listener);
  }, []);

  useEffect(() => {
    parent?.postMessage({
      type: 'progress-changed',
      inProgress,
    } satisfies SandboxEvent);
  }, [parent, inProgress]);

  return <></>;
}
