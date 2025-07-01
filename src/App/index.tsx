import { Route } from './Route';
import { Sandbox } from './Sandbox';
import './tests';
import { TestsUI } from './UI';

export function App() {
  return (
    <>
      <Route path="/" component={TestsUI} />
      <Route path="/home" component={Sandbox} />
    </>
  );
}
