import { expect } from '@wdio/globals'
import HomePage from '../pageobjects/home.page'
import TablesPage from '../pageobjects/tables.page'
import searchData from '../../test-data/search.json'

/**
 * Search and filter spec.
 *
 * The demo site has no search box of its own, so this spec exercises
 * search and filter over the site's own lists, the way a user would
 * look for an example and narrow a table down:
 *
 * - Home page (/): filter the list of available examples by link text.
 * - Data Tables (/tables): filter the rows of Example 1 by Last Name
 *   and by Due amount.
 * - Navigation: open a found example from the home page list.
 *
 * Search terms, expected matches and expected rows live in
 * test-data/search.json; base URL and timeouts come from
 * config/environments.ts via the runner. Nothing is hard-coded here.
 */
describe('Search and filter', () => {
  describe('home page example list', () => {
    beforeEach(async () => {
      await HomePage.open()
    })

    it('should show the home page heading', async () => {
      await expect(HomePage.heading).toHaveText(searchData.home.heading)
    })

    for (const search of searchData.home.searches) {
      it(`should find ${search.expectedCount} example(s) for "${search.term}"`, async () => {
        const texts = await HomePage.findLinkTexts(search.term)

        expect(texts.length).toBe(search.expectedCount)
        expect(texts).toEqual(search.expectedTexts)
      })
    }

    it('should open the found example from the home page list', async () => {
      const found = await HomePage.openLinkByText(searchData.navigation.linkText)

      expect(found).toBe(true)
      await expect(browser).toHaveUrl(new RegExp(searchData.navigation.expectedUrlPart))
    })
  })

  describe('data tables filter', () => {
    beforeEach(async () => {
      await TablesPage.open()
    })

    for (const row of searchData.tables.byLastName) {
      it(`should filter the table to the "${row.lastName}" row only`, async () => {
        const matches = await TablesPage.filterByLastName(row.lastName)

        expect(matches.length).toBe(row.expectedCount)
        expect(matches[0][0]).toBe(row.lastName)
        expect(matches[0][1]).toBe(row.firstName)
        expect(matches[0][2]).toBe(row.email)
        expect(matches[0][3]).toBe(row.due)
      })
    }

    it('should filter the table to the rows due the expected amount', async () => {
      const filter = searchData.tables.byDue
      const matches = await TablesPage.filterByDue(filter.due)

      expect(matches.length).toBe(filter.expectedCount)
      expect(matches.map((match) => match[0])).toEqual(filter.lastNames)
    })
  })
})
