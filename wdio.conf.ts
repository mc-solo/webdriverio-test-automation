import { environments, chromeOptions, firefoxOptions } from './config/environments'

export const config: WebdriverIO.Config = {
  runner: 'local',

  specs: ['./test/specs/**/*.ts'],
  exclude: [],

  maxInstances: environments.maxInstances,
  // One capability per browser in environments.browsers (default: Chrome
  // only). Set BROWSER=firefox or BROWSERS=chrome,firefox to change it.
  capabilities: environments.browsers.map((browserName) =>
    browserName === 'firefox'
      ? {
          browserName,
          'moz:firefoxOptions': firefoxOptions()
        }
      : {
          browserName,
          'goog:chromeOptions': chromeOptions()
        }
  ),

  logLevel: environments.logLevel,
  bail: 0,
  baseUrl: environments.baseUrl,
  waitforTimeout: environments.waitforTimeout,
  connectionRetryTimeout: environments.connectionRetryTimeout,
  connectionRetryCount: environments.connectionRetryCount,

  // No driver service needed: WebdriverIO 8.14+ / 9 downloads and manages
  // ChromeDriver and GeckoDriver automatically for the installed browser
  // version.
  // (The old @wdio/selenium-standalone-service is deprecated and has no v9 release.)
  services: [],

  framework: 'mocha',
  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false
    }]
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: environments.mochaTimeout
  }
}
