import { useTestsRegistry } from '@framework/react';
import { useRef } from 'react';
import { useBodyStyle } from './useBodyStyle';
import s from './ui.module.css';
import type { RunnerEvent } from '../ipc';

function sendSelected(ref: React.RefObject<HTMLIFrameElement | null>, id: string) {
  ref.current?.contentWindow?.postMessage({
    type: 'select',
    testId: id,
  } satisfies RunnerEvent);
}

export function SimpleUI() {
  const sandbox = useRef<HTMLIFrameElement>(null);
  const tests = useTestsRegistry();

  useBodyStyle('ui');

  return (
    <div>
      <iframe ref={sandbox} src="/sandbox" className={s.frame} />
      {Object.values(tests).map((test) => (
        <div onClick={() => sendSelected(sandbox, test.id)}>
          {test.id} {test.description}
        </div>
      ))}
    </div>
  );
}
