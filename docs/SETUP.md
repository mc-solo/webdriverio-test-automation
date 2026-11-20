# Setup

## Requirements

- Node.js 18+ (tested with the Node version that installed WebdriverIO 9)
- npm
- Google Chrome — required only to run the browser tests, not to install
  or type-check the project. WebdriverIO downloads the matching
  ChromeDriver for you; no separate driver service is configured.

## Install

```bash
npm install
```

## Configure (optional)

All runtime settings have safe defaults in `config/environments.ts`.
To change them, copy the example env file and edit it:

```bash
cp .env.example .env
```

| Variable | Default | What it does |
|---|---|---|
| `BASE_URL` | `https://the-internet.herokuapp.com` | Site under test |
| `BROWSER` | `chrome` | Browser to run against |
| `HEADLESS` | `true` | `false` to watch the browser (`npm run test:headed`) |
| `WINDOW_SIZE` | `1280,800` | Browser window size in headless mode |
| `WAITFOR_TIMEOUT` | `10000` | Element wait timeout, ms |
| `CONNECTION_RETRY_TIMEOUT` | `120000` | Driver connection retry window, ms |
| `CONNECTION_RETRY_COUNT` | `3` | Driver connection retries |
| `MOCHA_TIMEOUT` | `60000` | Per-test timeout, ms |
| `MAX_INSTANCES` | `1` | Parallel browser instances |
| `LOG_LEVEL` | `info` | wdio log level |

You can also set any of these inline without a `.env` file, e.g.
`BASE_URL=https://example.com npm test`. Never put real credentials in
`.env` — the only login data this project uses is the public demo account
in `test-data/login.json`, shown on the demo site itself.

## Verify the setup without a browser

```bash
npm run typecheck   # tsc --noEmit, must exit 0
```
