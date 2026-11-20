import { expect } from '@wdio/globals'
import DropdownPage from '../pageobjects/dropdown.page'
import dropdownData from '../../test-data/dropdown.json'

describe('Dropdown page', () => {
  beforeEach(async () => {
    await DropdownPage.open()
  })

  it('should show the dropdown with a placeholder selected by default', async () => {
    await expect(DropdownPage.dropdown).toBeDisplayed()
    await expect(DropdownPage.dropdown).toHaveValue(dropdownData.placeholderValue)
  })

  it('should select Option 1', async () => {
    const option = dropdownData.options[0]
    await DropdownPage.selectOption(option.value)
    await expect(DropdownPage.dropdown).toHaveValue(option.value)
    await expect(DropdownPage.dropdown).toHaveText(new RegExp(option.label))
  })

  it('should select Option 2', async () => {
    const option = dropdownData.options[1]
    await DropdownPage.selectOption(option.value)
    await expect(DropdownPage.dropdown).toHaveValue(option.value)
    await expect(DropdownPage.dropdown).toHaveText(new RegExp(option.label))
  })
})
