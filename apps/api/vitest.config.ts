import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Integration suites share one TEST_DATABASE_URL and truncate tables in
    // beforeEach — parallel test files would corrupt each other's state.
    fileParallelism: false
  }
});
