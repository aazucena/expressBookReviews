// @ts-check
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["line"], ["html"]],
  use: {
    // All requests we send go to this API endpoint.
    baseURL: "http://localhost:5000",
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
    video: "off",
    screenshot: "off",
    trace: "on",
  },
  projects: [
    {
      name: "api-tests",
    },
  ],
  webServer: {
    command: "npm run start",
    port: 5000,
    reuseExistingServer: true,
  },
});
