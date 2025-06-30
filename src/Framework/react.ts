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
  const [logs, setLogs] = useState<string[]>([]);

  function log(...args: unknown[]) {
    const messages = args.flatMap(processLogMessage);
    setLogs((logs) => [...logs, ...messages]);
  }

  return { logs, log };
}

//#region useTests
export function useTests() {
  const { logs, log } = useLogs();

  const [current, setCurrent] = useState<TestInstance>();
  const [generator, setGenerator] = useState<TestGenerator>();
  const [currentLine, setCurrentLine] = useState<number>();
  const isRunning = Boolean(current);

  function selectTest(instance: TestInstance | undefined) {
    setCurrent(instance);
    setGenerator(instance?.test());
  }

  async function runTest() {
    if (!generator) return;

    // Run test and catch assert and other errors
    try {
      log(`Running test: ${description}`);
      for await (const line of generator) {
        setCurrentLine(line);
        await new Promise((r) => setTimeout(r, 300));
      }
    } catch (e) {
      log('Test error', e);
    } finally {
      log('Completed!');
    }
  }

  async function startTest(instance: TestInstance) {
    // Reset
    cleanup();
    setLogs([]);

    // Run test
    runTest(instance);
    setCurrentLine(undefined);
    selectTest(undefined);
  }

  return {
    tests,
    startTest,
    selectTest,

    logs,
    current,
    currentLine,
    isRunning,
  };
}
