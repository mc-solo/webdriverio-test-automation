import { browser } from '@wdio/globals'

/**
 * Base page for the site under test.
 * Every page object extends this and only adds its own elements.
 * The base URL comes from config/environments.ts, never from here.
 */
export default class Page {
  /**
   * Open a path relative to baseUrl (see config/environments.ts).
   */
  public open (path: string) {
    return browser.url(path)
  }

  /** The green/red flash banner shown after login, logout and errors. */
  public get flashMessage () {
    return $('#flash')
  }

  /** Page heading, e.g. "Login Page", "Secure Area", "Checkboxes". */
  public get heading () {
    return $('h2')
  }
}
