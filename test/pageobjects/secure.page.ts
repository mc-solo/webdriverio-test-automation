import Page from './page'

/**
 * Secure area: /secure
 * Only reachable after a successful login (see login.spec.ts).
 */
class SecurePage extends Page {
  public get btnLogout () {
    return $('a[href="/logout"]')
  }

  public async logout () {
    await this.btnLogout.click()
  }

  public open () {
    return super.open('/secure')
  }
}

export default new SecurePage()
