# QA Automation Portfolio — Playwright & TypeScript

![GitHub Actions](https://github.com/KaiqueSnts/qa-portfolio/actions/workflows/tests.yml/badge.svg)


**[Ver relatório da última execução](https://kaiquesnts.github.io/qa-portfolio/)** (com vídeo e trace de cada teste)

A test automation project built with **Playwright Test and TypeScript**, covering web UI tests, REST API tests, and end-to-end (E2E) workflows. The project also includes a **GitHub Actions** pipeline to run tests continuously and upload HTML reports as workflow artifacts.

The goal is to demonstrate practical QA automation skills, including test design, reusable test components, API validation, test data management, and CI execution.

## Test Scope

| Layer | Application | Coverage |
|---|---|---|
| Web UI | [SauceDemo](https://www.saucedemo.com/) | Login, cart, checkout, required fields, and logout |
| REST API | [Restful Booker](https://restful-booker.herokuapp.com/) | Authentication, booking CRUD, HTTP status codes, and response data types |
| E2E | SauceDemo + Restful Booker | Reuse of UI authentication state and checkout flow with data prepared through the API |

### Web UI Tests

- Successful and unsuccessful login scenarios.
- Blocked-user and empty-credential validation.
- Cart item addition and removal.
- Checkout flow and confirmation.
- Validation of required checkout fields.
- Logout behavior.

### API Tests

- Token creation with valid credentials.
- Booking creation, retrieval, update, and deletion.
- Unauthorized update and delete requests.
- Handling of a nonexistent booking ID.
- Validation of selected response fields and data types.

### End-to-End Tests

The E2E scenario combines API setup with browser-based checkout. The project also uses a setup project to authenticate through the UI and save the browser storage state for dependent tests.

## Tech Stack

- **Playwright Test** — test runner, browser automation, API requests, and assertions.
- **TypeScript** — typed test code and reusable components.
- **GitHub Actions** — continuous integration.
- **Page Object Model (POM)** — page interaction classes under `pages/`.
- **API Client** — `BookingClient` centralizes booking API operations.
- **Fixtures** — shared setup, authentication token, and booking test data.
- **HTML Reporter** — execution report available locally and as a CI artifact.

## Project Structure

```text
.github/
└── workflows/
    └── tests.yml
clients/
└── bookingClient.ts
docs/
├── test-plan.md
└── test-cases.md
fixtures/
├── bookingData.ts
├── env.ts
├── index.ts
└── users.ts
pages/
├── CartPage.ts
├── CheckoutPage.ts
├── InventoryPage.ts
└── LoginPage.ts
tests/
├── api/
│   └── booking.spec.ts
├── e2e/
│   ├── auth.setup.ts
│   └── api-seeded-checkout.spec.ts
└── web/
    ├── cart.spec.ts
    ├── checkout.spec.ts
    └── login.spec.ts
playwright.config.ts
package.json
package-lock.json
```

## Design Decisions

### Page Object Model

Page classes encapsulate UI interactions, helping separate page behavior from test scenarios and reducing duplicated interaction code.

### Dedicated API Client

`BookingClient` centralizes requests to Restful Booker. Tests retain their own assertions so expected status codes and response behavior remain visible in each scenario.

### Fixtures and Test Data Cleanup

The `buildBooking()` helper creates booking payloads with generated data. The `createdBooking` fixture creates a booking before the test and attempts to delete it afterward, keeping setup and cleanup in a shared location.

### Reusing Authenticated Browser State

The `setup` project logs in through the UI and saves the browser storage state. The `web` and `e2e` projects depend on this setup. Login tests use their own scenarios to validate authentication behavior.

### Selectors and Synchronization

The Playwright configuration sets `data-test` as the test ID attribute. Tests use locators such as `getByRole()`, `getByPlaceholder()`, and `getByTestId()`, along with Playwright's built-in waiting behavior rather than fixed sleeps.

### Environment Configuration

Application URLs and API credentials are read from environment variables with defaults for the public demo services. See [Environment Variables](#environment-variables).

## Getting Started

### Prerequisites

- Node.js 18 or newer.
- npm.
- Git.

### Installation

Clone the repository and move into its directory:

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_DIRECTORY>
```

Install the dependencies from the lockfile:

```bash
npm ci
```

Install Chromium:

```bash
npx playwright install chromium
```

On Linux CI or a Linux machine where browser system dependencies are missing, use:

```bash
npm run install:browsers
```

### Run the Tests

Run the complete configured suite:

```bash
npm test
```

Run tests by project:

```bash
npm run test:web
npm run test:api
npm run test:e2e
```

Run tests by tag:

```bash
npm run test:smoke
npm run test:regression
```

Run the TypeScript type check:

```bash
npm run typecheck
```

Open the HTML report generated by the latest run:

```bash
npm run report
```

> Playwright's HTML report is generated by test runs. Run the tests before opening the report if no report is available.

## Environment Variables

The following variables are optional. If omitted, the defaults below are used.

| Variable | Default |
|---|---|
| `WEB_URL` | `https://www.saucedemo.com` |
| `API_URL` | `https://restful-booker.herokuapp.com` |
| `API_USERNAME` | `admin` |
| `API_PASSWORD` | `password123` |

These defaults are for the public demo services used by this project. Do not commit private credentials, access tokens, or authenticated browser state to the repository.

## Smoke and Regression Tags

Tests are marked with `@smoke` and/or `@regression` to support filtered execution.

- **Smoke:** a smaller set of critical scenarios.
- **Regression:** the broader suite of scenarios.

The exact tests included in each run are determined by the tags assigned in the test files and the `--grep` filter in the npm scripts.

## Continuous Integration

The workflow is defined in `.github/workflows/tests.yml`.

- **Pull Requests:** run tagged smoke tests.
- **Pushes to `main`:** run the full configured test suite.
- **Scheduled Runs:** run the full configured suite on a nightly schedule (03:00 UTC).
- **Manual Runs:** can be started with the GitHub Actions workflow dispatch option.
- **Parallel Jobs:** API tests and Web/E2E tests run in separate jobs.
- **Artifacts:** HTML report folders are uploaded for later inspection, with a configured retention period of 14 days.

The workflow uses Node.js 20. The project requires Node.js 18 or newer locally.

## Test Documentation

The `docs/` directory includes:

- [`test-plan.md`](docs/test-plan.md) — test scope, approach, and planning.
- [`test-cases.md`](docs/test-cases.md) — documented test scenarios and expected behavior.

## Known Limitations

- The tests depend on public demo applications and APIs. Service downtime, latency, rate limits, or changes to those services may cause failures unrelated to the test code.
- Restful Booker may return service-specific status codes or response formats. Assertions are based on the observed behavior of the target demo API and should be reviewed if that behavior changes.
- The CI jobs upload their own report artifacts. Because the jobs run separately, retrieve the artifact corresponding to the job you want to inspect.

## Roadmap

- [ ] Publish selected test reports or summaries for easier portfolio review.
- [ ] Add performance tests with k6 or JMeter.
- [ ] Expand browser coverage to Firefox and WebKit.
- [ ] Add visual regression checks with `toHaveScreenshot()`.
- [ ] Add formal schema validation with Zod or Ajv.

## Author

QA Automation Portfolio — Playwright & TypeScript.
