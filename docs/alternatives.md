# Other ways to test components in the browser

## Vitest + `happy-dom` / `jsdom`

`vite.config.ts`:

```ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest-setup.ts'],
  },
});
```

`vitest-setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

`Counter.test.tsx`:

```tsx
import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';
import { afterEach, expect, it } from 'vitest';

afterEach(cleanup);

it('increments', async () => {
  const screen = render(<Counter start={0} />);

  const increment = screen.getByText('Inc');
  await userEvent.click(increment);

  const count = screen.getByText('Count: 1');
  expect(count).toBeInTheDocument();
});
```

## Vitest browser mode

## Storybook 9 interaction tests

- [Here](https://storybook.js.org/docs/writing-tests/interaction-testing)

## Playwright component testing (experimental)

- [Here](https://playwright.dev/docs/test-components)
