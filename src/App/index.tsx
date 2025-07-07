import { Route } from './Route';
import { Sandbox } from './Sandbox';
import { TestsUI } from './UI';
import { SimpleUI } from './UI/SimpleUI';
import './tests';

export function App() {
  return (
    <>
      <Route path="/" component={SimpleUI} />
      <Route path="/sandbox" component={Sandbox} />
    </>
  );
}
