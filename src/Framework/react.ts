import { cleanup } from '@testing-library/react';
import { useState } from 'react';
import { tests, type TestGenerator, type TestInstance } from '.';

function processLogMessage(arg: unknown) {
  const lines =
    typeof arg === 'string' ? arg : arg instanceof Error ? arg.message : JSON.stringify(arg);

  return lines.split('\n');
}

export function useTests() {
  const [logs, setLogs] = useState<string[]>([]);

  const [current, setCurrent] = useState<TestInstance>();
  const [currentLine, setCurrentLine] = useState<number>();
  const isRunning = Boolean(current);

  const [generator, setGenerator] = useState<TestGenerator>();

  function log(...args: unknown[]) {
    const messages = args.flatMap(processLogMessage);
    setLogs((logs) => [...logs, ...messages]);
  }

  async function runTest({ description, test }: TestInstance) {
    // Run test and catch assert and other errors
    try {
      log(`Running test: ${description}`);
      for await (const line of test()) {
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
    setCurrent(instance);
    cleanup();
    setLogs([]);

    // Run test
    runTest(instance);
    setCurrentLine(undefined);
    setCurrent(undefined);
  }

  return {
    tests,
    startTest,
    logs,
    current,
    currentLine,
    isRunning,
  };
}
