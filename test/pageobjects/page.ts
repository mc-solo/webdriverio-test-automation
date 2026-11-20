import { browser } from '@wdio/globals'

/**
 * Base page for the-internet.herokuapp.com.
 * Every page object extends this and only adds its own elements.
 */
export default class Page {
  /**
   * Open a path relative to baseUrl (see wdio.conf.ts).
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
