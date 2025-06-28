import { useEffect } from 'react';
import { runTests } from './Counter.bt';
import s from './index.module.css';

//#region framework
export function App() {
  useEffect(() => {
    // React "Should not already be working" hack
    const delay = new Promise((r) => setTimeout(r, 0));
    delay.then(runTests);
  }, []);

  return (
    <>
      <div id="test-root" className={s.testRoot}></div>
      Footer
    </>
  );
}
