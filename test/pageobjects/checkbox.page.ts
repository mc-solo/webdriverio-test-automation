import Page from './page'

/**
 * Checkboxes page: /checkboxes
 * Two checkboxes: the first starts unchecked, the second starts checked.
 */
class CheckboxPage extends Page {
  public get checkboxes () {
    return $$('#checkboxes input[type="checkbox"]')
  }

  public async checkbox (index: number) {
    const boxes = await this.checkboxes
    return boxes[index]
  }

  public open () {
    return super.open('/checkboxes')
  }
}

export default new CheckboxPage()
