import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the Saucedemo login screen.
 * Keeps actions and locators well-typed and easy to reuse.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
  }

  /** Navigate to the login page. */
  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/');
  }

  /**
   * Fill the username and password fields then submit the form.
   * @param username - user name to type
   * @param password - password to type
   * @param opts - optional behaviour flags
   */
  async login(
    username: string,
    password: string,
    opts?: { waitForNavigation?: boolean; timeout?: number }
  ): Promise<void> {
    const { waitForNavigation = true, timeout } = opts ?? {};

    await this.usernameInput.fill(username, { timeout });
    await this.passwordInput.fill(password, { timeout });

    if (waitForNavigation) {
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'networkidle' }),
        this.loginButton.click(),
      ]);
    } else {
      await this.loginButton.click();
    }
  }

  /** Convenience: perform goto() then login() in one call. */
  async openAndLogin(
    username: string,
    password: string,
    opts?: { waitForNavigation?: boolean; timeout?: number }
  ): Promise<void> {
    await this.goto();
    await this.login(username, password, opts);
  }
}

export default LoginPage;
