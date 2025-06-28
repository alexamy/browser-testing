import { useEffect } from 'react';
import { runTests, tests } from './Counter.bt';
import s from './index.module.css';
import type { TestInstance } from '../Framework';

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
  useEffect(() => {
    // React "Should not already be working" hack
    const delay = new Promise((r) => setTimeout(r, 0));
    delay.then(runTests);
  }, []);

  return (
    <>
      <div id="test-root" className={s.testRoot}></div>
      <div className={s.framework}>
        <div>
          <h4>Test list</h4>
          <div className={s.testList}>
            {tests.map((instance, i) => (
              <TestLine key={i} instance={instance} />
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
