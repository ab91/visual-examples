import { NightwatchTests } from 'nightwatch';
import { DiffingMethod, DiffStatus } from '@saucelabs/nightwatch-sauce-visual-service';
const USERNAME =
  process.env.VISUAL_CHECK === 'true' ? 'visual_user' : 'standard_user';
const PASSWORD = 'secret_sauce';

const home: NightwatchTests = {
  // Simple test
  'Check Inventory Page': () => {
    browser
      .url('https://saucedemo.com')
      .setValue('input[data-test="username"]', USERNAME)
      .setValue('input[data-test="password"]', PASSWORD)
      .click('input[data-test="login-button"]')
      .waitForElementVisible('.inventory_list')
      .sauceVisualCheck('Inventory Page')
      .click('[data-test="add-to-cart-sauce-labs-backpack"]')
      .sauceVisualCheck('Added backpack to cart')
      // We expect 2 visual diffs, one for the Inventory Page and one for the Added backpack to cart
      // They are unapproved because we haven't approved them yet
      // .assert.sauceVisualResults(DiffStatus.Unapproved, 2);
  },
  
  // Test that utilizes Full Page Screenshot
  'Check Longer Inventory Page': () => {
    browser
      .url('https://saucedemo.com')
      .setValue('input[data-test="username"]', USERNAME)
      .setValue('input[data-test="password"]', PASSWORD)
      .click('input[data-test="login-button"]')
      .waitForElementVisible('.inventory_list')
      .url('https://saucedemo.com/inventory-long.html')
      .sauceVisualCheck('Inventory Page (full page)"', {fullPage: true})
  },
  // Test that ignores regions
  'Check Home Page with ignore regions': () => {
    const login = browser.page.login();
    login
      .navigate()
      .waitForElementVisible('@username')
      .sauceVisualCheck('Home Page', {
        diffingMethod: DiffingMethod.Balanced,
        regions: [
          {
            element: login.elements.username.selector,
            disableOnly: ['content'],
          },
          {
            element: login.elements.password.selector,
            enableOnly: [],
          },
          {
            element: { x: 100, y: 100, width: 200, height: 200 },
            enableOnly: [],
          },
        ],
      })
      // We expect 1 visual diff, one for the Home Page
      // They are unapproved because we haven't approved them yet
      // .assert.sauceVisualResults(DiffStatus.Unapproved, 1);
  },
  // Test that clips to an element
  'Backpack item page - Price Clip': () => {
      browser
        .url('https://saucedemo.com')
        .setValue('input[data-test="username"]', USERNAME)
        .setValue('input[data-test="password"]', PASSWORD)
        .click('input[data-test="login-button"]')
        .waitForElementVisible('.inventory_list')
        .click('[data-test="inventory-item-sauce-labs-backpack-img"]')
        .sauceVisualCheck('Backpage Item Page Price Check', {
          clipSelector: '.inventory_details_price',
      });
    }

    // TODO: Env Var for Project
};

export default home;
