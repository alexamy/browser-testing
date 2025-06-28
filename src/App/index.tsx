import { useEffect } from 'react';
import { runTests } from './Counter.bt';
import s from './index.module.css';

//#region TestsUI
export function TestsUI() {
  useEffect(() => {
    // React "Should not already be working" hack
    const delay = new Promise((r) => setTimeout(r, 0));
    delay.then(runTests);
  }, []);

  return (
    <>
      <div id="test-root" className={s.testRoot}></div>
      <div className={s.framework}>
        <div className={s.testList}>
          <h4>Test list</h4>
        </div>
        <div className={s.logger}>
          <h4>Logger</h4>
        </div>
      </div>
    </>
  );
}
