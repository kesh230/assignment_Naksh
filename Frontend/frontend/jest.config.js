/**
 * Jest Configuration for Frontend Testing
 * Configures test environment for React components with Babel
 */

export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    testMatch: ['**/*.test.js', '**/*.test.jsx'],
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/main.jsx',
        '!src/assets/**',
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 75,
            lines: 75,
            statements: 75
        }
    },
    testTimeout: 10000,
    verbose: true,
    bail: false,
    maxWorkers: '50%',
};
