import { useState } from 'react';
import { type TestInstance } from '../Framework';
import { useTests } from '../Framework/react';
import s from './index.module.css';
import './tests';

//#region TestLine
interface TestLineProps {
  instance: TestInstance;
  onClick(): void;
  disabled?: boolean;
}

function TestLine({ instance, onClick }: TestLineProps) {
  return (
    <div className={s.testLine} onClick={onClick}>
      {instance.description}{' '}
    </div>
  );
}

//#region TestsUI
export function TestsUI() {
  const { tests, startTest, currentLine, logs } = useTests();
  const [selected, setSelected] = useState<TestInstance>();

  function onStart() {
    if (!selected) return;
    startTest(selected);
  }

  function onStep() {
    if (!selected) return;
  }

  function onRestart() {
    if (!selected) return;
  }

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
                disabled={Boolean(selected)}
                onClick={() => setSelected(instance)}
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
          <div>
            {selected ? (
              <div className={s.codeButtons}>
                <button onClick={onStart}>Start</button>
                <button onClick={onStep}>Step</button>
                <button onClick={onRestart}>Restart</button>
              </div>
            ) : null}
          </div>
          <div className={s.codeLines}>
            {selected
              ? selected.lines.map((source, i) => (
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
