import { singleTestMachine } from '@framework/react';
import { tests, type TestInstance } from '@framework/test';
import { useActorRef, useSelector } from '@xstate/react';
import { useEffect, useState } from 'react';
import type { Actor } from 'xstate';
import type { RunnerEvent, SandboxEvent } from '../ipc';

//#region root
function useMessageDebug() {
  useEffect(() => {
    if (window.parent === window) {
      console.warn('Sandbox should be running in the iframe');
    }

    const listener = (ev: MessageEvent) => console.log(ev.data);

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);
}

function useSelectedInstance() {
  const [instance, setInstance] = useState<TestInstance>();

  useEffect(() => {
    function listener(ev: MessageEvent<RunnerEvent>) {
      if (ev.data.type === 'select') {
        const test = tests[ev.data.testId];
        setInstance(test);
      }
    }

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  return instance;
}

// Empty container to run tests
export function Sandbox() {
  const instance = useSelectedInstance();
  useMessageDebug();

  return <>{instance ? <TestComponent key={instance.id} instance={instance} /> : null}</>;
}

//#region intance
function useInProgressSend(actor: Actor<typeof singleTestMachine>) {
  const value = useSelector(actor, (snapshot) => snapshot.value);

  useEffect(() => {
    const inProgress = value === 'running' || value === 'stepping';

    window.parent.postMessage({
      type: 'progress-changed',
      inProgress,
    } satisfies SandboxEvent);
  }, [value]);
}

function TestComponent({ instance }: { instance: TestInstance }) {
  const actor = useActorRef(singleTestMachine, {
    input: { instance },
  });

  useInProgressSend(actor);

  const selected = useSelector(actor, (snapshot) => snapshot.context.instance.id);
  useEffect(() => console.log(selected), [selected]);

  return <></>;
}
