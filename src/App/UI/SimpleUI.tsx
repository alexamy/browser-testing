import { useTestsRegistry } from '@framework/react';
import { useEffect, useRef, useState } from 'react';
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
  const tests = useTestsRegistry();
  const sandbox = useRef<HTMLIFrameElement>(null);
  useBodyStyle('ui');

  const [selected, setSelected] = useState<string>();
  useEffect(() => {
    if (selected) sendSelected(sandbox, selected);
  }, [selected]);

  return (
    <div>
      <iframe ref={sandbox} src="/sandbox" className={s.frame} />

      {Object.values(tests).map((test) => (
        <div
          key={test.id}
          style={{ fontWeight: test.id === selected ? 'bold' : 'normal' }}
          onClick={() => setSelected(test.id)}
        >
          {test.id} {test.description}
        </div>
      ))}
    </div>
  );
}
