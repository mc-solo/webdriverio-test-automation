import Page from './page'

/**
 * Home page: /
 * The demo site has no search box of its own, so "search" here means
 * filtering the list of available examples on the home page by link
 * text (case-insensitive substring match). Search terms and expected
 * results live in test-data/search.json.
 */
class HomePage extends Page {
  public get exampleLinks () {
    return $$('#content ul li a')
  }

  /** Texts of the links whose text contains the term, in page order. */
  public async findLinkTexts (term: string): Promise<string[]> {
    const needle = term.toLowerCase()
    const links = await this.exampleLinks
    const texts: string[] = []
    for (const link of links) {
      const text = await link.getText()
      if (text.toLowerCase().includes(needle)) {
        texts.push(text)
      }
    }
    return texts
  }

  /**
   * Click the example link whose text exactly matches (case-insensitive).
   * Returns false when no link matches, instead of throwing.
   */
  public async openLinkByText (text: string): Promise<boolean> {
    const links = await this.exampleLinks
    for (const link of links) {
      if ((await link.getText()).toLowerCase() === text.toLowerCase()) {
        await link.click()
        return true
      }
    }
    return false
  }

  public open () {
    return super.open('/')
  }
}

export default new HomePage()
