import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * Central environment / runtime configuration.
 *
 * Single source of truth for everything the runner, page objects and specs
 * need at runtime. Nothing else in the repo hard-codes a base URL, a
 * timeout or a browser capability — those values live here and are
 * overridden with environment variables (see .env.example).
 *
 * Priority for every value: process.env > .env file > safe default below.
 * The .env file is loaded by the tiny parser in this file on purpose, so
 * the project needs no extra dependency (no dotenv) just to read it.
 * Real secrets never belong here or in .env.example — the login data in
 * test-data/ is the public demo account shown on the site itself.
 */

const envFile = path.resolve(process.cwd(), '.env')
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

function envInt (name: string, fallback: number): number {
  const raw = process.env[name]
  const parsed = raw === undefined ? NaN : parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

function envBool (name: string, fallback: boolean): boolean {
  const raw = process.env[name]
  if (raw === undefined) return fallback
  return ['1', 'true', 'yes'].includes(raw.toLowerCase())
}

/** Browsers this project can run against. Chrome is the default. */
export const supportedBrowsers = ['chrome', 'firefox'] as const
export type SupportedBrowser = (typeof supportedBrowsers)[number]

function isSupportedBrowser (name: string): name is SupportedBrowser {
  return (supportedBrowsers as readonly string[]).includes(name)
}

/**
 * Browsers to run against, in order. Set BROWSERS to a comma-separated
 * list (e.g. BROWSERS=chrome,firefox) to run the suite on several
 * browsers; a single BROWSER value is the same as a one-item list.
 * Unknown names are ignored; when none is valid, Chrome is used.
 */
function envBrowsers (): SupportedBrowser[] {
  const raw = process.env.BROWSERS ?? process.env.BROWSER ?? 'chrome'
  const names = raw.split(',').map((name) => name.trim().toLowerCase()).filter(Boolean)
  const valid = names.filter(isSupportedBrowser)
  return valid.length > 0 ? valid : ['chrome']
}

const browsers = envBrowsers()

export const environments = {
  /** Site under test. Default is the public demo site. */
  baseUrl:
    process.env.BASE_URL ?? 'https://the-internet.herokuapp.com',

  /** API under test for the combined API + UI spec. Default is the
   *  public JSONPlaceholder demo API. Override with API_BASE_URL. */
  apiBaseUrl:
    process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',

  /** Browser to run against. First entry of `browsers` below;
   *  override with BROWSER=firefox (or BROWSERS=chrome,firefox). */
  browserName: browsers[0],

  /** Browsers to run against, in order (see envBrowsers above). */
  browsers,

  /** Headless mode. Set HEADLESS=false to watch the browser. */
  headless: envBool('HEADLESS', true),

  /** Browser window size in headless mode. */
  windowSize: process.env.WINDOW_SIZE ?? '1280,800',

  /** How long `waitFor*` / expect assertions wait for an element. */
  waitforTimeout: envInt('WAITFOR_TIMEOUT', 10000),

  /** How long to keep retrying the connection to the browser driver. */
  connectionRetryTimeout: envInt('CONNECTION_RETRY_TIMEOUT', 120000),
  connectionRetryCount: envInt('CONNECTION_RETRY_COUNT', 3),

  /** Mocha per-test timeout. */
  mochaTimeout: envInt('MOCHA_TIMEOUT', 60000),

  /** Parallel browser instances. */
  maxInstances: envInt('MAX_INSTANCES', 1),

  logLevel: (process.env.LOG_LEVEL ?? 'info') as 'info' | 'warn' | 'error' | 'debug'
} as const

/** Chrome arguments, derived from the settings above. */
export function chromeOptions (): { args: string[] } {
  const args = ['--disable-gpu', '--no-sandbox', `--window-size=${environments.windowSize}`]
  if (environments.headless) args.unshift('--headless=new')
  return { args }
}

/** Firefox arguments, derived from the settings above. Mirrors chromeOptions. */
export function firefoxOptions (): { args: string[] } {
  const [width, height] = environments.windowSize.split(',')
  const args = [`--width=${width}`, `--height=${height}`]
  if (environments.headless) args.unshift('-headless')
  return { args }
}
