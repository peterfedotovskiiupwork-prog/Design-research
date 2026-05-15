import { defineConfig } from "@trigger.dev/sdk/v3";
import { puppeteer } from "@trigger.dev/build/extensions/puppeteer";

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_REF!,
  runtime: "node",
  logLevel: "debug",
  dirs: ["./src/trigger"],
  maxDuration: 600,
  retries: {
    enabled: true,
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 5000,
    maxTimeoutInMs: 60000,
  },
  build: {
    extensions: [puppeteer()],
  },
});
