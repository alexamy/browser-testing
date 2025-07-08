import { useTestsRegistry } from '@framework/react';
import { useEffect, useRef, useState } from 'react';
import { useBodyStyle } from './useBodyStyle';
import type { RunnerEvent, SandboxEvent } from '../ipc';
import type { TestInstance } from '@framework/test';
import s from './ui.module.css';

type IFrameRef = React.RefObject<HTMLIFrameElement | null>;

function sendSelected(ref: IFrameRef, id: string) {
  ref.current?.contentWindow?.postMessage({
    type: 'select',
    testId: id,
  } satisfies RunnerEvent);
}

function sendDirective(ref: IFrameRef, type: 'start' | 'step' | 'restart') {
  ref.current?.contentWindow?.postMessage({
    type,
  } satisfies RunnerEvent);
}

function useMessageDebug() {
  useEffect(() => {
    const listener = (ev: MessageEvent) => {
      if (ev.data?.source?.startsWith('react-devtool')) return;
      console.log('sandbox => runner', ev.data);
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);
}

function useSandboxState() {
  const [state, setState] = useState<SandboxEvent>();

  useEffect(() => {
    const listener = (ev: MessageEvent<SandboxEvent>) => {
      if (ev.data.type === 'update') {
        setState(ev.data);
      }
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  return state;
}

export function SimpleUI() {
  const tests = useTestsRegistry();
  const frame = useRef<HTMLIFrameElement>(null);

  useBodyStyle('ui');
  useMessageDebug();

  const [selected, setSelected] = useState<TestInstance>();
  useEffect(() => {
    if (selected) sendSelected(frame, selected.id);
  }, [selected]);

  const sandbox = useSandboxState();

  return (
    <>
      <iframe ref={frame} src="/sandbox" className={s.frame} />

      <div className={s.codeLines}>
        {Object.values(tests).map((test) => (
          <pre
            key={test.id}
            style={{ fontWeight: test.id === selected?.id ? 'bold' : 'normal' }}
            onClick={() => setSelected(test)}
          >
            {test.id} {test.description}
          </pre>
        ))}
      </div>

      {sandbox ? <SimpleUIContent frame={frame} sandbox={sandbox} /> : null}
    </>
  );
}

function SimpleUIContent({ frame, sandbox }: { frame: IFrameRef; sandbox: SandboxEvent }) {
  const tests = useTestsRegistry();
  const selected = tests[sandbox.currentTest];

  const canProceed = sandbox.state === 'ready';
  const inProgress = sandbox.state === 'running' || sandbox.state === 'stepping';

  return (
    <div>
      <>
        <button disabled={!canProceed} onClick={() => sendDirective(frame, 'start')}>
          Start
        </button>
        <button disabled={!canProceed} onClick={() => sendDirective(frame, 'step')}>
          Step
        </button>
        <button disabled={inProgress} onClick={() => sendDirective(frame, 'restart')}>
          Restart
        </button>

        <div className={s.codeLines}>
          {selected.source.map((line, i) => (
            <pre key={i} style={{ fontWeight: sandbox?.currentLine === i ? 'bold' : 'normal' }}>
              {line}
            </pre>
          ))}
        </div>
      </>

      {sandbox.logs.length > 0 ? (
        <div>
          Logs:
          {sandbox.logs.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
