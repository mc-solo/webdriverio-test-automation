import Page from './page'

/**
 * Data Tables page: /tables
 * Two tables with the same rows. The tests filter Example 1 (#table1)
 * by column value; the columns are Last Name (0), First Name (1),
 * Email (2), Due (3), Web Site (4). Filter values and expected rows
 * live in test-data/search.json.
 *
 * A filter returns the matching rows as arrays of cell texts, in
 * column order, so the spec can assert on plain data.
 */
class TablesPage extends Page {
  public get tableRows () {
    return $$('#table1 tbody tr')
  }

  /** Rows whose Last Name cell contains the value (case-insensitive). */
  public async filterByLastName (lastName: string): Promise<string[][]> {
    return this.filterRows(0, lastName)
  }

  /** Rows whose Due cell contains the value. */
  public async filterByDue (due: string): Promise<string[][]> {
    return this.filterRows(3, due)
  }

  private async filterRows (columnIndex: number, value: string): Promise<string[][]> {
    const needle = value.toLowerCase()
    const rows = await this.tableRows
    const matches: string[][] = []
    for (const row of rows) {
      const cells = await row.$$('td')
      const texts: string[] = []
      for (const cell of cells) {
        texts.push(await cell.getText())
      }
      const target = texts[columnIndex] ?? ''
      if (target.toLowerCase().includes(needle)) {
        matches.push(texts)
      }
    }
    return matches
  }

  public open () {
    return super.open('/tables')
  }
}

export default new TablesPage()
