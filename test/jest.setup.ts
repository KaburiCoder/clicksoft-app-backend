import { setupTestEnvironment, teardownTestEnvironment } from "./e2e/setup";

beforeEach(async () => {
  await setupTestEnvironment();
});

afterAll(async () => {
  await teardownTestEnvironment();
});
