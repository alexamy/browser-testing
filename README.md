# Testing React components in the browser

Just a fun project.

Powered by:

- React
- Vite
- Testing library
- Chai

## Quick start

```
npm i
npm run dev
```

## Description

### DX

Write tests in `.bt.tsx` files and import them inside the App.

- Use `import { render, it, userEvent } from '@framework/test';`
- Use assertions from `chai` package

Examples:

- Test - `App/Counter.bt.tsx` (bt for browser testing)

## How does it work?

- All tests run in browser
- Any `*.bt.tsx` file is transpiled by Vite plugin to allow inspection and step-by-step execution
- `Testing library` helpers and `Chai` assertions can work in browser

## Other approaches (not for comparison)

- Vitest + Testing library: `Counter.test.tsx`

```
git checkout vitest-happy-dom
npm i
npm run test
```

- Vitest browser mode + Playwright: `Counter.test.tsx`

```
git checkout playwright-browser
npm i
npm run test
```
