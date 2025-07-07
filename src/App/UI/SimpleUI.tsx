import { useTestsRegistry } from '@framework/react';
import { useRef } from 'react';
import { useBodyStyle } from './useBodyStyle';
import s from './ui.module.css';

export function SimpleUI() {
  const sandbox = useRef<HTMLIFrameElement>(null);
  const tests = useTestsRegistry();
  useBodyStyle('ui');

  return (
    <>
      <iframe ref={sandbox} src="/sandbox" className={s.frame} />
    </>
  );
}
