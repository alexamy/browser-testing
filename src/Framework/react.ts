import { cleanup } from '@testing-library/react';
import { useState } from 'react';
import { tests, type TestGenerator, type TestInstance } from '.';

export function useTestsRegistry() {
  return tests;
}

//#region useLogs
function processLogMessage(arg: unknown) {
  const lines =
    typeof arg === 'string' ? arg : arg instanceof Error ? arg.message : JSON.stringify(arg);

  return lines.split('\n');
}

function useLogs() {
  const [data, setData] = useState<string[]>([]);

  function log(...args: unknown[]) {
    const messages = args.flatMap(processLogMessage);
    setData((logs) => [...logs, ...messages]);
  }

  function reset() {
    setData([]);
  }

  return { data, log, reset };
}

//#region useTest
export function useTest() {
  const [instance, setInstance] = useState<TestInstance>();
  const [generator, setGenerator] = useState<TestGenerator>();
  const [currentLine, setCurrentLine] = useState<number>();
  const [inProgress, setInProgress] = useState(false);
  const [isDone, setIsDone] = useState(false);

  function select(test: TestInstance | undefined) {
    setInstance(test);
    setGenerator(test?.generator());
    setCurrentLine(undefined);
    setIsDone(false);
  }

  const restart = () => select(instance);

  async function step() {
    if (!generator) return;

    setInProgress(true);
    const { done, value: line } = await generator.next();
    setInProgress(false);

    const hasLine = line !== undefined && Number.isFinite(line);
    setCurrentLine(hasLine ? line : undefined);
    setIsDone(Boolean(done));
  }

  async function start(delay = 0) {
    if (!generator) return;

    setInProgress(true);
    for await (const line of generator) {
      setCurrentLine(line);
      if (delay > 0) {
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    setInProgress(false);

    setCurrentLine(undefined);
    setIsDone(true);
  }

  return { instance, currentLine, inProgress, isDone, select, step, start, restart };
}

//#region useTests
export function useTests() {
  const logs = useLogs();
  const test = useTest();

  const [stepDelay, setStepDelay] = useState(0);

  async function runWithLogs(f: () => void | Promise<void>) {
    try {
      await f();
    } catch (e) {
      logs.log('Test error', e);
    }
  }

  function select(instance: TestInstance | undefined) {
    // cleanup
    cleanup();
    logs.reset();

    // select
    test.select(instance);
  }

  function restart() {
    select(test.instance);
  }

  async function start() {
    test.restart();

    await runWithLogs(async () => {
      await test.start(stepDelay);
    });

    logs.log('Completed!');
  }

  async function step() {
    await runWithLogs(async () => {
      await test.step();
    });
  }

  function setStepDelayChecked(time: number) {
    if (time < 0) {
      throw new Error('Step time cannot be negative.');
    }

    setStepDelay(time);
  }

  return {
    tests,
    start,
    step,
    select,
    restart,

    stepDelay,
    setStepDelay: setStepDelayChecked,

    logs: logs.data,
    current: test.instance,
    currentLine: test.currentLine,
    isDone: test.isDone,
  };
}
