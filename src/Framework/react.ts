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
  const isRunning = Boolean(current);

  async function runWithLogs(f: () => void | Promise<void>) {
    try {
      await f();
    } catch (e) {
      logs.log('Test error', e);
    }
  }

  function selectTest(instance: TestInstance | undefined) {
    // cleanup
    cleanup();
    logs.reset();

    // select
    setCurrent(instance);
    setGenerator(instance?.test());
    setCurrentLine(undefined);
  }

  async function startTest() {
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

  const restartTest = () => selectTest(current);

  return {
    tests,
    startTest,
    selectTest,
    restartTest,

    logs: logs.data,
    current,
    currentLine,
    isRunning,
  };
}
