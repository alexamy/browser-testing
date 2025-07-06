import { type TestInstance } from '@framework/test';
import { useEffect, useState } from 'react';

function useParent() {
  const [parent, setParent] = useState<Window>();

  useEffect(() => {
    if (window.parent === window) {
      console.warn('Sandbox is meant to be loaded in the iframe.');
    }

    setParent(window.parent);
  }, []);

  return parent;
}

// Empty container to run tests
export function Sandbox() {
  const [current, setCurrent] = useState<TestInstance>();
  const [inProgress, setInProgress] = useState(false);
  const parent = useParent();

  return <></>;
}
