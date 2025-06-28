import { useEffect } from 'react';
import { runTests } from './Counter.bt';

//#region framework
export function App() {
  useEffect(() => {
    // React "Should not already be working" hack
    const delay = new Promise((r) => setTimeout(r, 0));
    delay.then(runTests);
  }, []);

  return (
    <>
      Test runner ui
      <div id="test-root"></div>
      Footer
    </>
  );
}
