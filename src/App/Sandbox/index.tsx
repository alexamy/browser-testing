import { singleTestMachine } from '@framework/machine';
import { tests, type TestInstance } from '@framework/test';
import { useActorRef, useSelector } from '@xstate/react';
import { useEffect, useState } from 'react';
import type { Actor } from 'xstate';
import type { RunnerEvent, SandboxEvent } from '../ipc';
import { cleanup } from '@testing-library/react';

//#region root
function useMessageDebug() {
  useEffect(() => {
    if (window.parent === window) {
      console.warn('Sandbox should be running in the iframe.');
    }

    const listener = (ev: MessageEvent) => {
      if (ev.data?.source?.startsWith('react-devtool')) return;
      console.log('runner => sandbox', ev.data);
    };

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
        cleanup();
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

//#region instance
function useActorController(actor: Actor<typeof singleTestMachine>) {
  useEffect(() => {
    function listener(ev: MessageEvent<RunnerEvent>) {
      if (ev.data.type === 'start') {
        actor.send({ type: 'start' });
      } else if (ev.data.type === 'step') {
        actor.send({ type: 'step' });
      } else if (ev.data.type === 'restart') {
        actor.send({ type: 'restart' });
      } else if (ev.data.type === 'select') {
        // do nothing, processed on level above
      } else {
        // exhaustive match
        throw new Error(ev.data satisfies never);
      }
    }

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [actor]);
}

function useActorUpdateSend(actor: Actor<typeof singleTestMachine>) {
  const state = useSelector(actor, (snapshot) => snapshot.value);

  const currentTest = useSelector(actor, (snapshot) => snapshot.context.instance.id);
  const currentLine = useSelector(actor, (snapshot) => snapshot.context.currentLine);
  const isDone = useSelector(actor, (snapshot) => snapshot.context.isDone);
  const logs = useSelector(actor, (snapshot) => snapshot.context.logs);

  useEffect(() => {
    window.parent.postMessage({
      type: 'update',
      state,
      currentTest,
      currentLine,
      isDone,
      logs,
    } satisfies SandboxEvent);
  }, [state, currentTest, currentLine, isDone, logs]);
}

function TestComponent({ instance }: { instance: TestInstance }) {
  const actor = useActorRef(singleTestMachine, {
    input: { instance },
  });

  useActorController(actor);
  useActorUpdateSend(actor);

  return <></>;
}
