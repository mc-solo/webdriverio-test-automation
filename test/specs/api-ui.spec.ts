import { expect } from '@wdio/globals'
import { environments } from '../../config/environments'
import LoginPage from '../pageobjects/login.page'
import SecurePage from '../pageobjects/secure.page'
import DropdownPage from '../pageobjects/dropdown.page'
import loginData from '../../test-data/login.json'
import apiUiData from '../../test-data/api-ui.json'

/**
 * Combined API + UI spec.
 *
 * Each test starts with an API call against the JSONPlaceholder demo
 * API (base URL from config/environments.ts, overridable with
 * API_BASE_URL) and then continues in the browser on
 * the-internet.herokuapp.com, using the page objects. API payloads,
 * ids and expected values live in test-data/api-ui.json; nothing is
 * hard-coded here.
 *
 * The API and the UI are different demo systems, so the link between
 * them is the test flow, not shared data: the API check proves the
 * backend answers, then the UI check proves the site works.
 */

async function apiGet (path: string) {
  const res = await fetch(`${environments.apiBaseUrl}${path}`)
  if (!res.ok) throw new Error(`API GET ${path} failed: ${res.status}`)
  return res.json()
}

async function apiPost (path: string, body: unknown) {
  const res = await fetch(`${environments.apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(`API POST ${path} failed: ${res.status}`)
  return { status: res.status, body: await res.json() }
}

describe('API + UI combined flow', () => {
  it('API returns the expected post, then UI login reaches the secure area', async () => {
    const post = await apiGet(`/posts/${apiUiData.postId}`) as { id: number, userId: number, title: string }
    expect(post.id).toBe(apiUiData.postId)
    expect(post.userId).toBe(apiUiData.expectedPostUserId)
    expect(typeof post.title).toBe('string')

    await LoginPage.open()
    await LoginPage.login(loginData.valid.username, loginData.valid.password)

    await expect(SecurePage.flashMessage).toBeDisplayed()
    await expect(SecurePage.flashMessage).toHaveText(
      new RegExp(loginData.expectedMessages.loginSuccess)
    )
    await expect(SecurePage.heading).toHaveText(loginData.expectedPages.secureHeading)
  })

  it('API returns a non-empty post list, then UI dropdown selects the expected option', async () => {
    const posts = await apiGet('/posts') as { id: number, title: string }[]
    expect(Array.isArray(posts)).toBe(true)
    expect(posts.length).toBeGreaterThan(0)
    expect(typeof posts[0].title).toBe('string')

    await DropdownPage.open()
    await DropdownPage.selectOption(apiUiData.dropdownOption.value)

    await expect(DropdownPage.dropdown).toHaveValue(apiUiData.dropdownOption.value)
  })

  it('API creates a post, then UI login and logout work', async () => {
    const created = await apiPost('/posts', apiUiData.newPost) as { status: number, body: { id: number, title: string, userId: number } }
    expect(created.status).toBe(201)
    expect(created.body.title).toBe(apiUiData.newPost.title)
    expect(created.body.userId).toBe(apiUiData.newPost.userId)
    expect(typeof created.body.id).toBe('number')

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
