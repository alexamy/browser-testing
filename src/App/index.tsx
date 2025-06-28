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
export function TestsUI() {
  const [current, setCurrent] = useState<TestInstance>();

  useEffect(() => {
    if (!current) return;

    async function run() {
      // React "Should not already be working" hack
      await new Promise((r) => setTimeout(r, 0));
      cleanup();
      await runTest(current!, { log: console.log });
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

        <div className={s.logger}>
          <h4>Logger</h4>
        </div>
      </div>
    </>
  );
}
