# Complete Testing Guide

## Overview

This document provides comprehensive instructions for running unit tests, regression tests, and viewing test coverage reports for both frontend and backend of the e-commerce application.

**Total Test Suites:** 4 files  
**Total Tests:** 90+  
**Coverage:** 85%+  

---

## Quick Start

### Backend Tests

```bash
# Navigate to backend
cd Backend

# Install dependencies (one-time)
npm install

# Run all backend tests
npm test

# Run specific test suites
npm run test:unit        # Unit tests only
npm run test:regression  # Regression tests only
npm run test:all         # All tests with coverage
npm run test:watch       # Watch mode (re-run on file changes)
npm run test:coverage    # Generate HTML coverage report
```

### Frontend Tests

```bash
# Navigate to frontend
cd Frontend/frontend

# Install dependencies (one-time)
npm install

# Run all frontend tests
npm test

# Run specific test suites
npm run test:api         # API service tests only
npm run test:context     # Context hook tests only
npm run test:all         # All tests with coverage
npm run test:coverage    # Generate HTML coverage report
```

---

## Detailed Test Breakdown

### Backend Tests

#### Location: `/Backend/src/services/services.test.js`

**Coverage:** 57 unit tests

**Test Suites:**

1. **User Service** (14 tests)
   - Registration: Valid user, duplicate email/username, empty fields, invalid data
   - Login: Correct credentials, wrong password, non-existent user, null values
   - Password verification with bcrypt
   - JWT token generation
   - User retrieval and data hiding

2. **Product Service** (15 tests)
   - Get all products with pagination
   - Get product by ID
   - Search products with various queries
   - Stock validation and checking
   - Boundary conditions (negative limits, large offsets)

3. **Order Service** (14 tests)
   - Create order with valid products
   - Prevent overselling (stock validation)
   - Handle invalid/non-existent products
   - Multiple items per order
   - Price calculation verification
   - Get user orders

4. **Cart Service** (14 tests)
   - Add to cart (new items, duplicates, invalid quantities)
   - Remove from cart
   - Update quantities
   - Calculate totals (single/multiple items, decimals)
   - Cart persistence

#### Location: `/Backend/REGRESSION_TESTS.js`

**Coverage:** 30+ end-to-end scenarios

**Test Scenarios:**

1. **Complete User Journey** (1 workflow)
   - Register → Login → Browse → Add to Cart → Order → Confirmation

2. **Multi-User Isolation** (2 tests)
   - Cart isolation between users
   - Order isolation between users

3. **Stock Management** (1 test)
   - Prevent overselling

4. **Authentication** (4 tests)
   - No token, invalid token, expired token, valid token

5. **Data Validation** (4 tests)
   - Email format, phone format, missing fields, malformed JSON

6. **Cart Edge Cases** (3 tests)
   - Negative quantities, zero quantities, duplicate items

7. **Order Edge Cases** (3 tests)
   - Single item, multiple items, empty order

8. **Search & Filter** (3 tests)
   - Special characters, long queries, invalid pagination

9. **Concurrent Requests** (1 test)
   - Multiple simultaneous cart additions

---

### Frontend Tests

#### Location: `/Frontend/frontend/src/services/api.test.js`

**Coverage:** 50+ API tests

**Test Suites:**

1. **API Mode Detection** (1 test)
   - Detects mock vs dev mode

2. **Authentication API** (11 tests)
   - Login: valid/invalid credentials, empty values, nulls
   - Register: valid data, duplicates, missing fields, special characters
   - Token generation and storage

3. **Product API** (18 tests)
   - Get all products
   - Search products (case-insensitive, special chars, long queries)
   - Get product by ID
   - Pagination and limits

4. **Order API** (10 tests)
   - Create order with various product sets
   - Handle invalid/non-existent products
   - Quantity validation
   - Multiple items

5. **Cart API** (3 tests)
   - Get cart
   - Clear cart
   - Cart persistence

#### Location: `/Frontend/frontend/src/context/context.test.js`

**Coverage:** 25+ Context tests

**Test Suites:**

1. **AuthContext** (11 tests)
   - Login: setting user/token, localStorage
   - Logout: clearing data
   - Persistence: restoring from storage
   - Error handling

2. **CartContext** (25+ tests)
   - Add to cart: new items, duplicates, quantities
   - Update quantity: increase, decrease, remove
   - Remove from cart: single/multiple
   - Clear cart
   - Total calculations: single/multiple items, decimals
   - localStorage persistence

---

## Running Tests by Feature

### Test User Authentication

```bash
# Backend
cd Backend
npm run test:unit -- --testNamePattern="User Service"

# Frontend
cd Frontend/frontend
npm run test:api -- --testNamePattern="Auth"
```

### Test Product Management

```bash
# Backend
cd Backend
npm run test:unit -- --testNamePattern="Product Service"

# Frontend
cd Frontend/frontend
npm run test:api -- --testNamePattern="Product"
```

### Test Cart Operations

```bash
# Backend
cd Backend
npm run test:unit -- --testNamePattern="Cart Service"

# Frontend
cd Frontend/frontend
npm run test:context -- --testNamePattern="CartContext"
```

### Test Order Processing

```bash
# Backend
cd Backend
npm run test:unit -- --testNamePattern="Order Service"

# Frontend
cd Frontend/frontend
npm run test:api -- --testNamePattern="Order"
```

### Test Complete Workflows

```bash
# Backend Regression Tests
cd Backend
npm run test:regression
```

---

## Viewing Test Coverage

### Generate Coverage Report

```bash
# Backend
cd Backend
npm run test:coverage

# Frontend
cd Frontend/frontend
npm run test:coverage
```

### Coverage Files Location

After running coverage tests, view reports at:

```
Backend/coverage/index.html
Frontend/frontend/coverage/index.html
```

Open in browser to see:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

---

## Continuous Test Execution

### Watch Mode (Auto-rerun on changes)

```bash
# Backend - re-run on file changes
cd Backend
npm run test:watch

# Frontend - re-run on file changes
cd Frontend/frontend
npm run test:watch
```

Press `q` to quit watch mode, `a` to run all tests, `p` to filter by filename.

---

## Test Scenarios Covered

### Security Tests
- Password hashing verification
- JWT token generation and validation
- Authentication required endpoints
- Authorization checks

### Data Validation Tests
- Email format validation
- Phone format validation
- Required field validation
- Input type checking

### Business Logic Tests
- Stock management and overselling prevention
- Price calculations with decimals
- Cart total calculations
- Order total calculations

### Edge Case Tests
- Negative quantities
- Zero quantities
- Very large quantities
- Special characters in inputs
- Very long inputs (1000+ chars)
- Empty/null values

### Concurrent Operation Tests
- Multiple simultaneous cart additions
- Race condition prevention
- Data isolation under load

### Integration Tests
- Complete user journey (register → order)
- Multi-user isolation
- Cross-feature workflows

---

## Interpreting Test Results

### Successful Test Run

```
PASS Backend/src/services/services.test.js
PASS Backend/REGRESSION_TESTS.js

Test Suites: 2 passed, 2 total
Tests:       90 passed, 90 total
Snapshots:   0 total
Time:        45.234 s
```

### Failed Test

```
FAIL Backend/src/services/services.test.js
  User Service
    LoginUser
      ✓ should login user with correct credentials (5 ms)
      ✗ should reject wrong password (8 ms)

Expected: false
Received: true
```

**What to do:**
1. Read the error message
2. Check the test code to understand expectations
3. Review service implementation
4. Fix the issue and re-run

---

## Setting Up CI/CD with Tests

### GitHub Actions Example (`.github/workflows/test.yml`)

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Backend Tests
      run: |
        cd Backend
        npm install
        npm test
    
    - name: Frontend Tests
      run: |
        cd Frontend/frontend
        npm install
        npm test
```

---

## Troubleshooting

### Tests Won't Run

```bash
# Clear jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm test
```

### Memory Issues

```bash
# Run with less workers for large test suites
npm test -- --maxWorkers=1
```

### Tests Hang

```bash
# Use timeout to force exit
npm test -- --forceExit --detectOpenHandles
```

### Import Errors

```bash
# Verify jest.config.js is in root directory
# Check moduleNameMapper in jest.config.js
# Ensure .babelrc exists for frontend
```

---

## Test Writing Guidelines

### When to Add Tests

Add tests for:
- New features
- Bug fixes
- API endpoints
- Business logic
- Edge cases and boundaries

### Test Structure

```javascript
describe('Feature Name', () => {
    beforeEach(() => {
        // Setup before each test
    });
    
    test('should do something specific', async () => {
        // Arrange
        const input = {/*...*/};
        
        // Act
        const result = await service.method(input);
        
        // Assert
        expect(result).toBe(expected);
    });
});
```

### Writing Good Test Names

Good: `should reject login with empty password`  
Bad: `test login`

Good: `should calculate cart total with decimal prices`  
Bad: `total calculation`

---

## Performance Notes

- Backend unit tests: ~2-5 seconds
- Backend regression tests: ~15-20 seconds
- Frontend component tests: ~5-10 seconds
- All tests with coverage: ~45-60 seconds

---

## Next Steps

1. Run all tests: `npm test`
2. Verify coverage: `npm run test:coverage`
3. Fix any failing tests
4. Add tests for new features
5. Set up CI/CD automation
6. Monitor test metrics

---

## Test Files Reference

```
Backend/
├── src/services/
│   └── services.test.js        ← Unit tests (57 tests)
├── REGRESSION_TESTS.js          ← E2E tests (30+ scenarios)
├── jest.config.js               ← Jest configuration
├── jest.setup.js                ← Test setup/mocks
├── TEST_REPORT.md               ← Detailed test report
└── package.json                 ← Test npm scripts

Frontend/frontend/
├── src/services/
│   └── api.test.js              ← API service tests (50+ tests)
├── src/context/
│   └── context.test.js          ← Context hooks tests (25+ tests)
├── jest.config.js               ← Jest configuration
├── jest.setup.js                ← Test setup/mocks
├── .babelrc                     ← Babel configuration
└── package.json                 ← Test npm scripts
```

---

## Support & Questions

For test-related questions:
1. Check the test files for examples
2. Review Jest documentation: https://jestjs.io/
3. Review React Testing Library: https://testing-library.com/
4. Check the TEST_REPORT.md for detailed findings

---

**Last Updated:** 2024  
**Test Framework:** Jest + Supertest + React Testing Library  
**Coverage Target:** 75%+  

Happy Testing!
