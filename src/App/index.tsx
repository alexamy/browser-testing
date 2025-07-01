import { useEffect } from 'react';
import { Route } from './Route';
import s from './index.module.css';

export function App() {
  useEffect(() => {
    const path = window.location.pathname;

    if (path === '/') {
      document.body.classList.add(s.uiRoot);
    }
  }, []);

  return (
    <>
      <Route path="/" component={() => <div>Hello!</div>} />
      <Route path="/home" component={() => <div>Home!</div>} />
    </>
  );
}
