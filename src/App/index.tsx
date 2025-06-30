import { type TestInstance } from '../Framework';
import { useTests } from '../Framework/react';
import s from './index.module.css';
import './tests';

//#region TestLine
interface TestLineProps {
  instance: TestInstance;
  onClick(): void;
  selected?: boolean;
}

function TestLine({ instance, onClick, selected }: TestLineProps) {
  return (
    <div
      className={s.testLine}
      onClick={onClick}
      style={{ fontWeight: selected ? 'bold' : 'normal' }}
    >
      {instance.description}{' '}
    </div>
  );
}

//#region TestsUI
export function TestsUI() {
  const t = useTests();

  return (
    <>
      <div id="test-root" className={s.testRoot}></div>
      <div className={s.framework}>
        <div>
          <h4>Test list</h4>
          <div className={s.testList}>
            {t.tests.map((instance, i) => (
              <TestLine
                key={i}
                instance={instance}
                selected={instance === t.current}
                onClick={() => t.select(instance)}
              />
            ))}
          </div>
        </div>

        <div>
          <h4>Code</h4>
          <div>
            {t.current ? (
              <div className={s.codeButtons}>
                <button onClick={t.start}>Start</button>
                <button onClick={t.step} disabled={t.isDone}>
                  Step
                </button>
                <button onClick={t.restart}>Restart</button>
              </div>
            ) : null}
          </div>
          <div className={s.codeLines}>
            {t.current
              ? t.current.lines.map((source, i) => (
                  <pre key={i} style={{ fontWeight: i === t.currentLine ? 'bold' : 'normal' }}>
                    {source}
                  </pre>
                ))
              : null}
          </div>
        </div>

        <div>
          <h4>Logger</h4>
          <div className={s.logList}>
            {t.logs.map((logLine, i) => (
              <p key={i}>{logLine}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
