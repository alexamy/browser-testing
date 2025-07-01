import { Route } from './Route';
import { Sandbox } from './Sandbox';
import { TestsUI } from './UI';
import './tests';

export function App() {
  return (
    <>
      <Route path="/" component={TestsUI} />
      <Route path="/sandbox" component={Sandbox} />
    </>
  );
}
