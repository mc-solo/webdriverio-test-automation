import { expect } from '@wdio/globals'
import CheckboxPage from '../pageobjects/checkbox.page'
import checkboxData from '../../test-data/checkboxes.json'

describe('Checkboxes page', () => {
  beforeEach(async () => {
    await CheckboxPage.open()
  })

  it('should show two checkboxes, first unchecked and second checked', async () => {
    const boxes = await CheckboxPage.checkboxes
    await expect(boxes).toBeElementsArrayOfSize(checkboxData.expectedCount)

    for (const { index, selected } of checkboxData.initialState) {
      const box = await CheckboxPage.checkbox(index)
      await expect(box).toBeDisplayed()
      if (selected) {
        await expect(box).toBeSelected()
      } else {
        await expect(box).not.toBeSelected()
      }
    }
  })

  it('should check the first checkbox when clicked', async () => {
    const first = await CheckboxPage.checkbox(checkboxData.initialState[0].index)

    await expect(first).not.toBeSelected()
    await first.click()
    await expect(first).toBeSelected()
  })

  it('should uncheck the second checkbox when clicked', async () => {
    const second = await CheckboxPage.checkbox(checkboxData.initialState[1].index)

    await expect(second).toBeSelected()
    await second.click()
    await expect(second).not.toBeSelected()
  })
})
