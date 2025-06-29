import { useState } from 'react';
import { runTest, tests, type TestInstance } from '.';
import { cleanup } from '@testing-library/react';

function processLogMessage(arg: unknown) {
  const lines =
    typeof arg === 'string' ? arg : arg instanceof Error ? arg.message : JSON.stringify(arg);

  return lines.split('\n');
}

export function useTests() {
  const [logs, setLogs] = useState<string[]>([]);

  const [current, setCurrent] = useState<TestInstance>();
  const [line, setLine] = useState(0);
  const isRunning = Boolean(current);

  function log(...args: unknown[]) {
    const messages = args.flatMap(processLogMessage);
    setLogs((logs) => [...logs, ...messages]);
  }

  async function startTest(instance: TestInstance) {
    // Reset
    setCurrent(instance);
    cleanup();
    setLogs([]);

    // Run test
    await runTest(instance, { log, setLine });
    setCurrent(undefined);
  }

  return {
    tests,
    startTest,
    logs,
    current,
    isRunning,
    line,
  };
}
