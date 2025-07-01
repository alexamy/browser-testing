import { Route } from './Route';

export function App() {
  return (
    <>
      <Route path="/" component={() => <div>Hello!</div>} />
      <Route path="/home" component={() => <div>Home!</div>} />
    </>
  );
}
