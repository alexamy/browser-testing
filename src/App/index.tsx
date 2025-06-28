import { useEffect, useMemo, useState } from 'react';
import { tests } from './Counter.bt';
import s from './index.module.css';
import { runTest, type TestInstance } from '../Framework';
import { cleanup } from '@testing-library/react';

//#region TestLine
interface TestLineProps {
  instance: TestInstance;
  onStart(): void;
  disabled?: boolean;
}

function TestLine({ instance, onStart, disabled = false }: TestLineProps) {
  return (
    <div>
      {instance.description}
      <br />
      <button disabled={disabled} onClick={onStart}>
        Start
      </button>
    </div>
  );
}

//#region TestsUI
function processLogMessage(arg: unknown) {
  return typeof arg === 'string'
    ? arg.split('\n')
    : JSON.stringify(arg instanceof Error ? arg.message : arg);
}

function useTests() {
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

export function TestsUI() {
  const { startTest, isRunning, logs } = useTests();

  return (
    <>
      <div id="test-root" className={s.testRoot}></div>
      <div className={s.framework}>
        <div>
          <h4>Test list</h4>
          <div className={s.testList}>
            {tests.map((instance, i) => (
              <TestLine
                key={i}
                instance={instance}
                disabled={isRunning}
                onStart={() => startTest(instance)}
              />
            ))}
          </div>
        </div>

        <div>
          <h4>Logger</h4>
          <div className={s.logger}>
            {logs.map((logLine, i) => (
              <p key={i}>{logLine}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
