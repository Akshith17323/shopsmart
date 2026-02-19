# Testing & CI Documentation

## Overview

This project uses a comprehensive testing strategy:

- **Unit & Integration Tests**: `vitest` + `react-testing-library` + `msw` (Network Mocks).
- **E2E Tests**: `playwright`.
- **CI/CD**: GitHub Actions.

## Running Tests Locally

### Unit & Integration Tests

Run all unit tests:

```bash
npm test
# OR
npm run test:ci
```

### E2E Tests

Run all E2E tests (headless):

```bash
npm run test:e2e
```

Run E2E tests with UI:

```bash
npm run test:e2e:ui
```

## Creating New Tests

### Unit Tests

Create files ending in `.test.jsx` or `.test.js`. Use `msw` handlers in `src/mocks/handlers.js` to mock API responses.

### E2E Tests

Create files in `e2e/`. Use `playwright` APIs.

## CI Pipeline

The GitHub Actions workflow is defined in `.github/workflows/client-ci.yml`. It runs on every push and PR to `main`.
It performs:

1. Linting
2. Unit Tests
3. E2E Tests
4. Uploads Playwright report on failure.
