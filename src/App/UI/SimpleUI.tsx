import { useTestsRegistry } from '@framework/react';
import { useRef } from 'react';
import { useBodyStyle } from './useBodyStyle';

export function SimpleUI() {
  const sandbox = useRef<HTMLIFrameElement>(null);
  const tests = useTestsRegistry();
  useBodyStyle('ui');

  return <></>;
}
