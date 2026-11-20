import Page from './page'

/**
 * Dropdown page: /dropdown
 * One select with a placeholder option plus "Option 1" and "Option 2".
 */
class DropdownPage extends Page {
  public get dropdown () {
    return $('#dropdown')
  }

  public async selectOption (value: string) {
    await this.dropdown.selectByAttribute('value', value)
  }

  public open () {
    return super.open('/dropdown')
  }
}

export default new DropdownPage()
