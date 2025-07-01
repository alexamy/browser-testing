import { Route } from './Route';
import './tests';

export function App() {
  return (
    <>
      <Route path="/" component={() => <div>Hello!</div>} />
      <Route path="/home" component={() => <div>Home!</div>} />
    </>
  );
}
