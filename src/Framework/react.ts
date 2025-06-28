import { useState } from 'react';
import { runTest, type TestInstance } from '.';
import { cleanup } from '@testing-library/react';

function processLogMessage(arg: unknown) {
  return typeof arg === 'string'
    ? arg.split('\n')
    : JSON.stringify(arg instanceof Error ? arg.message : arg);
}

export function useTests() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  function log(...args: unknown[]) {
    const messages = args.flatMap(processLogMessage);
    setLogs((logs) => [...logs, ...messages]);
  }

  async function startTest(instance: TestInstance) {
    // Reset
    setIsRunning(true);
    cleanup();
    setLogs([]);

    // Run test
    await runTest(instance, { log });
    setIsRunning(false);
  }

  return {
    startTest,
    isRunning,
    logs,
  };
}
