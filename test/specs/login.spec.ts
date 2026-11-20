import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page'
import SecurePage from '../pageobjects/secure.page'
import loginData from '../../test-data/login.json'

describe('Login page', () => {
  it('should log in with valid credentials and show the secure area', async () => {
    await LoginPage.open()
    await LoginPage.login(loginData.valid.username, loginData.valid.password)

    await expect(SecurePage.flashMessage).toBeDisplayed()
    await expect(SecurePage.flashMessage).toHaveText(
      new RegExp(loginData.expectedMessages.loginSuccess)
    )
    await expect(SecurePage.heading).toHaveText(loginData.expectedPages.secureHeading)
    await expect(browser).toHaveUrl(new RegExp(loginData.expectedPages.secureUrlPart))
  })

  it('should show an error message with a wrong password', async () => {
    await LoginPage.open()
    await LoginPage.login(loginData.invalidPassword.username, loginData.invalidPassword.password)

    await expect(LoginPage.flashMessage).toBeDisplayed()
    await expect(LoginPage.flashMessage).toHaveText(
      new RegExp(loginData.expectedMessages.invalidPassword)
    )
    await expect(browser).toHaveUrl(new RegExp(loginData.expectedPages.loginUrlPart))
  })

  it('should show an error message with a wrong username', async () => {
    await LoginPage.open()
    await LoginPage.login(loginData.invalidUsername.username, loginData.invalidUsername.password)

    await expect(LoginPage.flashMessage).toBeDisplayed()
    await expect(LoginPage.flashMessage).toHaveText(
      new RegExp(loginData.expectedMessages.invalidUsername)
    )
  })

  it('should log out from the secure area back to the login page', async () => {
    await LoginPage.open()
    await LoginPage.login(loginData.valid.username, loginData.valid.password)
    await SecurePage.logout()

    await expect(LoginPage.flashMessage).toBeDisplayed()
    await expect(LoginPage.flashMessage).toHaveText(
      new RegExp(loginData.expectedMessages.logoutSuccess)
    )
    await expect(browser).toHaveUrl(new RegExp(loginData.expectedPages.loginUrlPart))
  })
})
