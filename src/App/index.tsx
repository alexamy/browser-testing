import { useEffect } from 'react';
import { tests } from './Counter.bt';
import { runTests, TEST_ROOT_ID } from './framework';

//#region framework
export function App() {
  useEffect(() => {
    // React "Should not already be working" hack
    const delay = new Promise((r) => setTimeout(r, 0));
    delay.then(() => runTests(tests));
  }, []);

  return (
    <>
      Test runner ui
      <div id={TEST_ROOT_ID}></div>
      Footer
    </>
  );
}
