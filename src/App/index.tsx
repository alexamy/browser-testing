import { type TestInstance } from '../Framework';
import { useTests } from '../Framework/react';
import s from './index.module.css';
import './Counter.bt';

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
  const { tests, startTest, isRunning, logs } = useTests();

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
