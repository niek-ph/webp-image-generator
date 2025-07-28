import {cleanupTestEnvironment} from './setup';

// Global cleanup before all tests
beforeAll(async () => {
    await cleanupTestEnvironment();
});

// Global cleanup after all tests
afterAll(async () => {
    await cleanupTestEnvironment();
});

// Increase timeout for all tests
jest.setTimeout(10000);