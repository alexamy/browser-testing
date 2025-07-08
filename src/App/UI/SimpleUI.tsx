import { useTestsRegistry } from '@framework/react';
import { useEffect, useRef, useState } from 'react';
import { useBodyStyle } from './useBodyStyle';
import type { RunnerEvent, SandboxEvent } from '../ipc';
import type { TestInstance } from '@framework/test';
import s from './ui.module.css';

function useMessageDebug() {
  useEffect(() => {
    const listener = (ev: MessageEvent) => {
      if (ev.data?.source?.startsWith('react-devtool')) return;
      console.log('runner receive', ev.data);
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);
}

function useSandboxState() {
  const [state, setState] = useState<SandboxEvent>();

  useEffect(() => {
    const listener = (ev: MessageEvent<SandboxEvent>) => {
      setState(ev.data);
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  return state;
}

function sendSelected(ref: React.RefObject<HTMLIFrameElement | null>, id: string) {
  ref.current?.contentWindow?.postMessage({
    type: 'select',
    testId: id,
  } satisfies RunnerEvent);
}

function sendDirective(
  ref: React.RefObject<HTMLIFrameElement | null>,
  type: 'start' | 'step' | 'restart'
) {
  ref.current?.contentWindow?.postMessage({
    type,
  } satisfies RunnerEvent);
}

export function SimpleUI() {
  const tests = useTestsRegistry();
  const frame = useRef<HTMLIFrameElement>(null);

  useBodyStyle('ui');
  useMessageDebug();

  const sandbox = useSandboxState();
  const [selected, setSelected] = useState<TestInstance>();
  useEffect(() => {
    if (selected) sendSelected(frame, selected.id);
  }, [selected]);

  return (
    <div>
      <iframe ref={frame} src="/sandbox" className={s.frame} />

      {Object.values(tests).map((test) => (
        <div
          key={test.id}
          style={{ fontWeight: test.id === selected?.id ? 'bold' : 'normal' }}
          onClick={() => setSelected(test)}
        >
          {test.id} {test.description}
        </div>
      ))}

      {selected ? (
        <>
          <button onClick={() => sendDirective(frame, 'start')}>Start</button>
          <button onClick={() => sendDirective(frame, 'step')}>Step</button>
          <button onClick={() => sendDirective(frame, 'restart')}>Restart</button>
          <div className={s.codeLines}>
            {selected.source.map((line, i) => (
              <pre key={i} style={{ fontWeight: sandbox?.currentLine === i ? 'bold' : 'normal' }}>
                {line}
              </pre>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
