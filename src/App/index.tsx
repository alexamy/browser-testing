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
      {instance.description}{' '}
      <button disabled={disabled} onClick={onStart}>
        {'>'}
      </button>
    </div>
  );
}

//#region TestsUI
export function TestsUI() {
  const { tests, startTest, current, currentLine, isRunning, logs } = useTests();

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
          <div className={s.logList}>
            {logs.map((logLine, i) => (
              <p key={i}>{logLine}</p>
            ))}
          </div>
        </div>

        <div>
          <h4>Code</h4>
          <div className={s.codeLines}>
            {current
              ? current.lines.map((source, i) => (
                  <pre key={i} style={{ fontWeight: i === currentLine ? 'bold' : 'normal' }}>
                    {source}
                  </pre>
                ))
              : null}
          </div>
        </div>
      </div>
    </>
  );
}
