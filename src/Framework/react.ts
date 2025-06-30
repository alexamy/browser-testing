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
export function useTests() {
  const logs = useLogs();

  const [current, setCurrent] = useState<TestInstance>();
  const [generator, setGenerator] = useState<TestGenerator>();
  const [currentLine, setCurrentLine] = useState<number>();
  const [isDone, setIsDone] = useState(false);

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
    setCurrent(instance);
    setGenerator(instance?.test());
    setCurrentLine(undefined);
    setIsDone(false);
  }

  async function start() {
    if (!current || !generator) return;

    logs.log(`Running test: ${current.description}`);

    await runWithLogs(async () => {
      for await (const line of generator) {
        setCurrentLine(line);
        await new Promise((r) => setTimeout(r, 300));
      }
    });

    logs.log('Completed!');
  }

  async function step() {
    if (!generator) return;

    await runWithLogs(async () => {
      const { done, value: line } = await generator.next();
      setIsDone(Boolean(done));

      const isLineNumber = line !== undefined && Number.isFinite(line);
      if (isLineNumber) setCurrentLine(line);
    });
  }

  const restart = () => select(current);

  return {
    tests,
    start,
    step,
    select,
    restart,

    logs: logs.data,
    current,
    currentLine,
    isDone,
  };
}
