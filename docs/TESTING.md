# Testing

## What is tested

All tests run against [the-internet.herokuapp.com](https://the-internet.herokuapp.com),
a public demo site, in headless Chrome. Test data lives in `test-data/`
— no credentials, messages, option values or expected states are
hard-coded in the specs.

| Spec | Tests | What it checks |
|---|---|---|
| `test/specs/login.spec.ts` | 4 | Valid login reaches the secure area; wrong password and wrong username show errors; logout returns to the login page |
| `test/specs/checkbox.spec.ts` | 3 | Both checkboxes shown with their starting state; clicking checks the first and unchecks the second |
| `test/specs/dropdown.spec.ts` | 3 | Dropdown shown with placeholder selected; selecting Option 1 and Option 2 |

10 tests total. The login data (`test-data/login.json`) is the demo
account shown on the site itself (`tomsmith` / `SuperSecretPassword!`)
— dummy test credentials only.

## How to run

```bash
npm test                  # full suite, headless Chrome
npm run test:headed       # same suite with a visible browser
npx wdio run wdio.conf.ts --spec ./test/specs/login.spec.ts   # one spec file
```

## Reports

```bash
npm run test:report        # build the Allure report from allure-results/
npm run test:report:open   # open it in the browser
```

The `spec` reporter also prints results to the console during the run.

## Typecheck (no browser needed)

```bash
npm run typecheck   # tsc --noEmit
```

## Current status

Typecheck passes (`npx tsc --noEmit` exits 0). Browser tests have
**not** been run yet — no Chrome is installed on the machine this was
built on, so no test results are claimed here. Run `npm test` on a
machine with Chrome to get the first real results, then update the
README with the real numbers.
