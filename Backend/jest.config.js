/**
 * Jest Configuration for Backend Testing
 * Configures test environment, coverage thresholds, and module paths
 */

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/index.js',
        '!src/db/db.js'
    ],
    coverageThreshold: {
        global: {
            branches: 75,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
    moduleNameMapper: {},
    testTimeout: 10000,
    verbose: true,
    bail: false,
    forceExit: true,
    detectOpenHandles: true,
    maxWorkers: '50%',
    roots: [
        '<rootDir>/src',
        '<rootDir>'
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    globals: {
        'ts-jest': {
            isolatedModules: true
        }
    }
};
