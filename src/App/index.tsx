import { useEffect, useState } from 'react';
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
  return typeof arg === 'string' ? arg.split('\n') : JSON.stringify(arg);
}

export function TestsUI() {
  const [current, setCurrent] = useState<TestInstance>();
  const [logs, setLogs] = useState<string[]>([]);

  function log(...args: unknown[]) {
    const messages = args.flatMap(processLogMessage);
    setLogs((logs) => [...logs, ...messages]);
  }

  useEffect(() => {
    if (!current) return;

    async function run() {
      // React "Should not already be working" hack
      await new Promise((r) => setTimeout(r, 0));

      // Prepare
      cleanup();
      setLogs([]);

      // Run test
      await runTest(current!, { log });
      setCurrent(undefined);
    }

    run();
  }, [current]);

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
                disabled={Boolean(current)}
                onStart={() => setCurrent(instance)}
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
