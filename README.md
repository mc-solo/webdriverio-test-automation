# webdriverio-test-automation

WebdriverIO (TypeScript) end-to-end tests for [the-internet.herokuapp.com](https://the-internet.herokuapp.com), a public demo site. Page Object Model, Mocha, spec + Allure reporting.

## Stack

- WebdriverIO 9 (`@wdio/cli`, `@wdio/local-runner`, `@wdio/mocha-framework`)
- TypeScript + `ts-node` (async mode)
- No driver service: since WebdriverIO 8.14, the runner downloads and manages ChromeDriver automatically for the installed Chrome version. The old `@wdio/selenium-standalone-service` is deprecated and has no v9 release, so this project does not use it.
- Reporters: `spec` (console) + `allure`

## What is covered

| Spec | What it checks |
|---|---|
| `test/specs/login.spec.ts` (4 tests) | Valid login reaches the secure area; wrong password and wrong username show errors; logout returns to the login page |
| `test/specs/checkbox.spec.ts` (3 tests) | Both checkboxes shown with their starting state; clicking checks the first and unchecks the second |
| `test/specs/dropdown.spec.ts` (3 tests) | Dropdown shown with placeholder selected; selecting Option 1 and Option 2 |

Demo login used by the tests (shown on the site itself): `tomsmith` / `SuperSecretPassword!`

## Install

```bash
npm install
```

## Run

```bash
npx wdio run wdio.conf.ts
# or
npm test
```

Tests run in headless Chrome. You need Google Chrome installed on your machine; WebdriverIO downloads the matching ChromeDriver for you.

## Reports

```bash
npm run test:report        # build the Allure report from allure-results/
npm run test:report:open   # open it in the browser
```

## Typecheck

```bash
npm run typecheck   # tsc --noEmit
```

## Project layout

```
wdio.conf.ts                 # runner config: baseUrl, headless Chrome, Mocha, reporters
test/
  pageobjects/
    page.ts                  # base page: open(), flash banner, heading
    login.page.ts            # /login
    secure.page.ts           # /secure
    checkbox.page.ts         # /checkboxes
    dropdown.page.ts         # /dropdown
  specs/
    login.spec.ts
    checkbox.spec.ts
    dropdown.spec.ts
```

## Status

Scaffold created 2026-11-18. Verified locally: `npm install` added 493 packages (WebdriverIO 9.33.1 resolved) and `npx tsc --noEmit` exits 0 with no errors. Browser tests have **not** been run yet — no Chrome is installed on the machine this was built on, so no test results are claimed here. Run `npm test` on a machine with Chrome to get the first real results, then update this section with the real numbers.
