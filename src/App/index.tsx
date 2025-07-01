import { useEffect } from 'react';
import { Route } from './Route';

export function App() {
  useEffect(() => {
    const path = window.location.pathname;

    if (path === '/') {
      document.body.classList.add('ui-root');
    }
  }, []);

  return (
    <>
      <Route path="/" component={() => <div>Hello!</div>} />
      <Route path="/home" component={() => <div>Home!</div>} />
    </>
  );
}
