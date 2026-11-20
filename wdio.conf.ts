import { environments, chromeOptions } from './config/environments'

export const config: WebdriverIO.Config = {
  runner: 'local',

  specs: ['./test/specs/**/*.ts'],
  exclude: [],

  maxInstances: environments.maxInstances,
  capabilities: [
    {
      browserName: environments.browserName,
      'goog:chromeOptions': chromeOptions()
    }
  ],

  logLevel: environments.logLevel,
  bail: 0,
  baseUrl: environments.baseUrl,
  waitforTimeout: environments.waitforTimeout,
  connectionRetryTimeout: environments.connectionRetryTimeout,
  connectionRetryCount: environments.connectionRetryCount,

  // No driver service needed: WebdriverIO 8.14+ / 9 downloads and manages
  // ChromeDriver automatically for the installed Chrome version.
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
