# Jest Unit Testing Setup Walkthrough

I have successfully set up Jest for unit testing the frontend application. The tests are located in the `tests` directory.

## Changes Made

- **Installed Dependencies**: `jest`, `ts-jest`, `@testing-library/react`, and related packages.
- **Configured Jest**: Created `jest.config.ts` and `jest.setup.ts` to handle TypeScript, JSDOM environment, and path aliases.
- **Configured TypeScript**: Created `tsconfig.jest.json` and `tests/aliases.d.ts` to handle specific package version imports used in the project.
- **Added Scripts**: Added `test` script to `package.json`.
- **Created Tests**:
  - `tests/App.test.tsx`: Unit test for the main `App` component (mocking child components).
  - `tests/components/Header.test.tsx`: Unit test for the `Header` component.
- **Fixed Code**: Updated `App.tsx` to remove extra props passed to `AdminDashboard` which were causing TypeScript errors.

## How to Run Tests

Run the following command in the terminal:

```bash
npm test
```

This will run all tests using Jest.

## Test Structure

- `tests/`: Contains all test files.
- `tests/__mocks__/`: Contains mocks for static assets (images, etc.).
- `tests/components/`: Contains component-specific tests.
- `jest.config.ts`: Main Jest configuration.
- `jest.setup.ts`: Global test setup (e.g., extending expect matchers).

## Verification Results

Ran `npm test` and confirmed that all tests passed:

```
PASS  tests/components/Header.test.tsx
PASS  tests/App.test.tsx
```

## Functional Testing (Playwright)

Functional tests are located in the `e2e` directory.

### How to Run Functional Tests

Run the following command:

```bash
npm run test:e2e
```

To run tests with UI mode:

```bash
npm run test:e2e:ui
```

### Test Structure

- `e2e/home.spec.ts`: Tests for Home Page navigation.
- `e2e/login.spec.ts`: Tests for Login flow.
- `e2e/admin.spec.ts`: Tests for Admin Login and Dashboard.
- `e2e/admin-members.spec.ts`: Tests for Member Management.
- `e2e/admin-offerings.spec.ts`: Tests for Offering Management.
- `e2e/admin-tickets.spec.ts`: Tests for Ticket Management.
- `playwright.config.ts`: Playwright configuration.
- `e2e/member.spec.ts`: Tests for Member Portal.
- `e2e/public-pages.spec.ts`: Tests for Public Pages.

### Verification Results
- **Unit Tests**: All tests passed (`npm test`).
- **E2E Tests**: All 42 tests passed (`npm run test:e2e`).
  - Home Page: Navigation and responsiveness verified.
  - Login: Member and Admin login flows verified.
  - Admin: Dashboard, Members, Offerings, Tickets management verified.
  - Member: Dashboard, My Details, My Offerings, My Tickets verified.
  - Public Pages: All public pages load correctly with correct headings.

## Next Steps
- Implement backend API endpoints to support the frontend fully.
- Add more granular tests for edge cases.
- Set up CI/CD pipeline for automated testing.

