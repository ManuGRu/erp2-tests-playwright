// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. */
  use: {
    /* Ensure the browser opens in full screen mode */
    launchOptions: {
      headless: false, // Ensure the browser is visible
      args: [
        '--start-maximized', // This flag maximizes the browser window
        '--disable-extensions', // Optional: disable extensions for better performance
        '--disable-infobars' // Optional: disable info bars for a cleaner window
      ],
    },
    viewport: null, // Ensure the viewport matches the full window size

    /* Enable tracing for all tests */
    trace: 'on', // Enables trace for all test runs
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--start-maximized'], // Additional Chromium-specific flag
        },
      },
    },

    /* {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
          args: ['--kiosk'], // Full-screen mode for Firefox
        },
      },
    }, */

    /* {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
      },
    }, */
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
