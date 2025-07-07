import { tests, type TestInstance } from '@framework/test';
import { useEffect, useState } from 'react';
import type { RunnerEvent, SandboxEvent } from '../ipc';
import { singleTestMachine, useTest, useTestsRegistry } from '@framework/react';
import { cleanup } from '@testing-library/react';
import { useActor, useActorRef, useSelector } from '@xstate/react';
import type { Actor, ActorRef } from 'xstate';

//#region root
function useCheckParent() {
  useEffect(() => {
    if (window.parent === window) {
      console.warn('Sandbox should be running in the iframe');
    }
  }, []);
}

function useSelectedInstance() {
  const [instance, setInstance] = useState<TestInstance>();

  useEffect(() => {
    window.addEventListener('message', (ev: MessageEvent<RunnerEvent>) => {
      console.log('getting', ev.data);
      if (ev.data.type === 'select') {
        const test = tests[ev.data.testId];
        setInstance(test);
      }
    });
  }, []);

  return instance;
}

// Empty container to run tests
export function Sandbox() {
  const instance = useSelectedInstance();
  useCheckParent();

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
