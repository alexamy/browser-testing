# Testing React components in the browser

Just a fun project.

## Quick start

```
npm i
npm run dev
```

Write tests in any tsx file and import them inside App.

- Wraps `render` to render on specific dom element
- Re-export `userEvent` for convenience
- Use `chai` for assertions

Examples:

- Test - `App/Counter.bt.tsx` (bt for browser-testing)
- UI - `App/index.tsx`

## Other approaches (not for comparison)

`Counter.test.tsx`

- Vitest + Testing library

```
git checkout vitest-happy-dom
npm i
npm run test
```

- Vitest browser mode + Playwright

```
git checkout playwright-browser
npm i
npm run test
```
