# Testing React components in the browser

Just a fun project.

## Quick start

```
npm i
npm run dev
```

## Description

Write tests in any `.bt.tsx` file and import them inside the App.

- Use `import { render, it, userEvent } from '../Framework';`
- Use assertions from `chai` package

Examples:

- Test - `App/Counter.bt.tsx` (bt for browser testing)

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
