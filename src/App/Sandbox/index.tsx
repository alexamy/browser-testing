import { tests, type TestInstance } from '@framework/test';
import { useEffect, useState } from 'react';
import type { RunnerEvent, SandboxEvent } from '../ipc';
import { singleTestMachine, useTest, useTestsRegistry } from '@framework/react';
import { cleanup } from '@testing-library/react';
import { useActorRef, useSelector } from '@xstate/react';

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
function TestComponent({ instance }: { instance: TestInstance }) {
  const test = useActorRef(singleTestMachine, {
    input: { instance },
  });

  const selected = useSelector(test, (snapshot) => snapshot.context.instance.id);
  useEffect(() => console.log(selected), [selected]);

  return <></>;
}
