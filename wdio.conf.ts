export const config: WebdriverIO.Config = {
  runner: 'local',

  specs: ['./test/specs/**/*.ts'],
  exclude: [],

  maxInstances: 1,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless=new', '--disable-gpu', '--no-sandbox', '--window-size=1280,800']
      }
    }
  ],

  logLevel: 'info',
  bail: 0,
  baseUrl: 'https://the-internet.herokuapp.com',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

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
    timeout: 60000
  }
}
