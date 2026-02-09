/**
 * Jest Setup File
 * Global test configuration, setup, and teardown
 */

// Increase test timeout for integration tests
jest.setTimeout(10000);

// Mock console methods to reduce test output noise (optional)
global.console = {
    ...console,
    // Uncomment to suppress console logs during tests
    // log: jest.fn(),
    // debug: jest.fn(),
    // info: jest.fn(),
    error: console.error,
    warn: console.warn,
};

// Setup global test utilities
beforeAll(async () => {
    // Initialize any global state
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
});

afterAll(async () => {
    // Cleanup after all tests
    // Close database connections if applicable
});

// Setup before each test
beforeEach(() => {
    // Reset any mocks or state before each test
    jest.clearAllMocks();
});

// Teardown after each test
afterEach(() => {
    // Cleanup after each test
    jest.clearAllTimers();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Export utilities for tests
module.exports = {
    // Add any global test utilities here
};
