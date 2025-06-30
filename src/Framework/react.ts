import { cleanup } from '@testing-library/react';
import { useState } from 'react';
import { tests, type TestGenerator, type TestInstance } from '.';

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

//#region useTests
function useTest() {
  const [instance, setInstance] = useState<TestInstance>();
  const [generator, setGenerator] = useState<TestGenerator>();
  const [currentLine, setCurrentLine] = useState<number>();
  const [isDone, setIsDone] = useState(false);

  function select(test: TestInstance | undefined) {
    setInstance(test);
    setGenerator(test?.method());
    setCurrentLine(undefined);
    setIsDone(false);
  }

  const restart = () => select(instance);

  async function step() {
    if (!generator) return;

    const { done, value: line } = await generator.next();
    const hasLine = line !== undefined && Number.isFinite(line);

    setCurrentLine(hasLine ? line : undefined);
    setIsDone(Boolean(done));
  }

  async function run() {
    if (!generator) return;

    for await (const line of generator) {
      setCurrentLine(line);
    }

    setCurrentLine(undefined);
    setIsDone(true);
  }

  return { instance, currentLine, isDone, select, step, run, restart };
}

export function useTests() {
  const logs = useLogs();
  const test = useTest();

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
      await test.run();
    });

    logs.log('Completed!');
  }

  async function step() {
    await runWithLogs(async () => {
      test.step();
    });
  }

  return {
    tests,
    start,
    step,
    select,
    restart,

    logs: logs.data,
    current: test.instance,
    currentLine: test.currentLine,
    isDone: test.isDone,
  };
}
