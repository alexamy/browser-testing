import { tests, type TestInstance } from '@framework/test';
import { singleTestMachine, useTests } from '@framework/react';
import { useBodyStyle } from './useBodyStyle';
import s from './ui.module.css';
import { useEffect, useRef } from 'react';
import type { RunnerEvent } from '../ipc';
import { useActor } from '@xstate/react';

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
      {instance.id} {instance.description}
    </div>
  );
}

//#region TestsUI
export function TestsUI() {
  const sandbox = useRef<HTMLIFrameElement>(null);
  const t = useTests();

  const [state, send] = useActor(singleTestMachine, {
    input: {
      instance: Object.values(tests).at(0)!,
    },
  });

  send({ type: 'run' });

  useBodyStyle('ui');

  useEffect(() => {
    if (!t.selected) return;

    sandbox.current?.contentWindow?.postMessage({
      type: 'select',
      testId: t.selected.id,
    } satisfies RunnerEvent);

    sandbox.current?.contentWindow?.postMessage({
      type: 'start',
    } satisfies RunnerEvent);
  }, [t.selected]);

  return (
    <>
      <iframe ref={sandbox} src="/sandbox" className={s.frame} />

      <div className={s.framework}>
        <div>
          <h4>Test list</h4>
          <div className={s.testList}>
            {Object.values(t.tests).map((instance, i) => (
              <TestLine
                key={i}
                instance={instance}
                selected={instance === t.selected}
                onClick={() => t.select(instance)}
              />
            ))}
          </div>
        </div>

        <div>
          <h4>Code</h4>
          <div>
            {t.selected ? (
              <div className={s.codeButtons}>
                <button onClick={t.start} disabled={t.isDone}>
                  Start
                </button>
                <button onClick={t.step} disabled={t.isDone}>
                  Step
                </button>
                <button onClick={t.restart}>Restart</button>
                <label>
                  Step delay:{' '}
                  <input
                    type="number"
                    min={0}
                    value={t.stepDelay}
                    onChange={(e) => t.setStepDelay(parseInt(e.currentTarget.value))}
                    style={{ width: '100px' }}
                  />
                </label>
              </div>
            ) : null}
          </div>
          <div className={s.codeLines}>
            {t.selected
              ? t.selected.source.map((lines, i) => (
                  <pre key={i} style={{ fontWeight: i === t.currentLine ? 'bold' : 'normal' }}>
                    {lines}
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
