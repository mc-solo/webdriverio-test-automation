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

export const environments = {
  /** Site under test. Default is the public demo site. */
  baseUrl:
    process.env.BASE_URL ?? 'https://the-internet.herokuapp.com',

  /** API under test for the combined API + UI spec. Default is the
   *  public JSONPlaceholder demo API. Override with API_BASE_URL. */
  apiBaseUrl:
    process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',

  /** Browser to run against (chrome is the only one configured). */
  browserName: process.env.BROWSER ?? 'chrome',

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
