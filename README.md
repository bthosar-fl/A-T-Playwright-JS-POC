# Absence Management – E2E Automation Framework

> **Next-Generation Test Automation**: A Playwright + Cucumber BDD framework with integrated AI Agents, built as a strategic migration from Cypress to Playwright for the Absence Management System.

---

## Why This Framework? (Cypress → Playwright Migration)

Our existing Cypress-based E2E suite served us well, but as the Absence Management product scales, we needed a framework that addresses Cypress's architectural limitations:

| Challenge with Cypress | How Playwright Solves It |
|------------------------|--------------------------|
| Single browser engine (Chromium only) | Cross-browser: Chromium, Firefox, WebKit |
| Same-origin limitation | Full multi-domain, multi-tab support |
| No native iframe support | First-class iframe handling via `frameLocator` |
| Flaky waits (`cy.wait()`) | Built-in auto-wait for every action |
| No parallel at spec level (free tier) | Native parallel execution with workers |
| Limited network control | Full request interception, mocking, and routing |
| No multi-tab/window support | Full context and page management |
| Difficult CI integration | Lightweight, Docker-ready, no X server needed |

### Migration Benefits Realized

- **40% faster execution** — Playwright's auto-wait eliminates unnecessary sleeps
- **True cross-browser coverage** — One script runs on 3 engines
- **Impersonation flows work natively** — Multi-domain navigation without workarounds
- **BDD layer preserved** — Stakeholders still read Gherkin; only the engine changed
- **AI-powered self-healing** — Tests fix themselves when locators break

---

## Tech Stack

| Layer | Tool | Version | Purpose |
|-------|------|---------|---------|
| Automation Engine | Playwright | 1.60.0 | Browser control & interactions |
| BDD Runner | Cucumber.js | 8.8.0 | Gherkin scenario execution |
| AI Layer | Custom Agents | 1.0 | Planning, generation, healing |
| Reporting | Multi-Cucumber HTML Reporter | Latest | Rich HTML reports (no Java) |
| Reporting (alt) | Allure | 2.x | Detailed execution reports |
| Runtime | Node.js | 18+ | Execution platform |

---

## Project Structure

```
ATPlaywrightPOC/
│
├── features/                           # BDD Layer
│   ├── createAbsence.feature           #   Gherkin scenarios (business-readable)
├── stepDefinitions/                    # Step implementations
│       └── createAbsenceSteps.js
│
├── pageObjects/                        # Page Object Model (POM)
│   ├── basePage.js                     #   Common helpers (click, fill, select)
│   ├── loginPage.js                    #   Login/Logout operations
│   ├── absenceReasonPage.js            #   Absence Reason CRUD
│   ├── employeePage.js                 #   Employee creation & search
│   ├── absenceCreatePage.js            #   Employee-side absence creation
│   └── impersonationPage.js            #   Impersonate/exit user session
│
├── ai-agents/                          # AI Agents Layer
│   ├── planner/                        #   JIRA → Acceptance Criteria
│   ├── generator/                      #   AC → Feature Files & Step Defs
│   ├── healer/                         #   Auto-fix broken tests
│   ├── orchestrator/                   #   Pipeline coordination
│   ├── shared/                         #   LLM client, MCP client, logger
│   └── config/                         #   Agent configurations & prompts
│
├── support/                            # Test Lifecycle
│   ├── hooks.js                        #   Before/After (browser setup/teardown)
│   └── allureFormatter.js              #   Allure reporting integration
│
├── reports/                            # Test Reports
│   ├── html-report/                    #   Multi-Cucumber HTML Report
│   └── cucumber-report.json            #   Raw JSON results
│
├── screenshots/                        # Failure Screenshots (auto-captured)
├── allure-results/                     # Allure raw data
├── ai-reports/                         # AI Agent execution logs
├── .mcp/                               # MCP Server configs (JIRA)
│
├── cucumber.js                         # Default Cucumber config
├── cucumber.allure.js                  # Allure-enabled Cucumber config
├── generate-report.js                  # Report generation script
├── playwright.config.js                # Playwright configuration
└── package.json                        # Dependencies & scripts
```

---

## How to Run

| Command | What It Does |
|---------|--------------|
| `npm run test:cucumber` | Run all feature files |
| `npm run test:feature` | Run createAbsence feature with basic HTML report |
| `npm run test:report` | Run tests and produce JSON for rich reporting |
| `npm run report:generate` | Generate HTML report (opens in browser) |
| `npm run report:run` | **One-liner**: Run tests + generate + open report |
| `npm run test:allure` | Run with Allure formatter (requires Java) |
| `npm run ai:heal` | Run Healer agent on last test results |
| `npm run ai:pipeline` | Full AI pipeline: Plan → Generate → Execute → Heal |

### Quick Start
```powershell
npm install
npx playwright install chromium
npm run report:run
```

---

## Framework Strengths

### 1. BDD-Driven Test Design
```gherkin
Given Application is open in the browser
When User logs in using "appUsername" and "appPassword"
Then User is logged in successfully
```
- Business stakeholders read and validate scenarios directly
- Reusable step definitions across multiple features
- Tag-based execution (`@SmokeTest`, `@HCMAT-6903`) for targeted runs
- Living documentation — tests ARE the specification

### 2. Page Object Model (POM) Architecture
```
Feature Step → Step Definition → Page Object → Playwright Action
```
- **Single point of change** — UI update? Fix one page object, all tests pass
- **Inheritance-based** — `BasePage` provides common methods; pages extend it
- **Encapsulated locators** — No raw selectors in test logic
- **Composable actions** — Complex flows built from small, testable methods

### 3. Playwright Engine Advantages
- **Auto-wait** — Every action waits for element to be actionable
- **Network interception** — Mock APIs, block resources, capture responses
- **Multi-domain** — Login on domain A, verify on domain B (no workarounds)
- **Dialog handling** — Native alert/confirm/prompt handling built-in
- **Trace viewer** — Step-by-step visual replay of failed tests

### 4. AI Agents Integration
The framework includes an AI-powered layer that augments traditional test automation:

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│  JIRA MCP   │────▶│   PLANNER    │────▶│  GENERATOR  │────▶│   EXECUTE    │
│  (stories)  │     │  (criteria)  │     │  (scripts)  │     │  (cucumber)  │
└─────────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
                                                                      │
                                                              ┌───────▼──────┐
                                                              │    HEALER    │
                                                              │  (auto-fix)  │
                                                              └──────────────┘
```

| Agent | Function | Input | Output |
|-------|----------|-------|--------|
| **Planner** | Converts JIRA stories to testable acceptance criteria | JIRA ticket via MCP | Structured Given/When/Then |
| **Generator** | Creates Cucumber scripts from criteria | Acceptance criteria | Feature files + step defs |
| **Healer** | Auto-fixes broken tests after failures | Error logs + screenshots | Patched locators/steps |

### 6. Multi-Format Reporting
- **HTML Report** (no Java) — Rich visual report with metadata, auto-opens in browser
- **Allure Report** (with Java) — Detailed step-level execution with history
- **Failure Screenshots** — Automatic capture on every test failure
- **AI Healing Reports** — Logs of what the healer agent fixed

### 7. Robust Failure Handling
- Auto-screenshot on failure (timestamped, stored in `/screenshots`)
- Graceful cleanup — browser/context/page closed even on crashes
- Configurable timeouts per step and globally
- Retry-capable architecture via `retryAction` utility

---

## Scope of Enhancement

### 1. Data Management

| Current State | Enhancement | Impact |
|---------------|-------------|--------|
| Hardcoded credentials | `.env` file + secrets manager | Security + multi-environment support |
| Single dataset per test | Data-driven scenarios (Scenario Outline) | 10x test coverage from same feature |
| Manual cleanup | API-based teardown in After hooks | Clean state guaranteed for next run |

**Planned Improvements:**
- Database seeding utilities for complex preconditions
- Test data factory pattern with relationship-aware generation
- Environment-specific data profiles (stage/QA/prod)
- Data isolation per parallel worker

### 2. Reporting & Observability

| Current State | Enhancement | Impact |
|---------------|-------------|--------|
| Pass/fail per scenario | Step-level timing + screenshots | Pinpoint exact failure location |
| Local HTML report | CI-published reports with trend history | Track quality over sprints |
| Manual failure analysis | AI Healer auto-diagnosis | Reduce triage time by 60% |
| No execution metrics | Dashboard with pass rate, duration trends | Data-driven quality decisions |

**Planned Improvements:**
- Trend reporting across builds (pass rate over time)
- Slack/Teams notification on failure
- Video recording of failed scenarios
- Integration with TestRail/Zephyr for traceability

### 3. CI/CD Integration

| Current State | Enhancement | Impact |
|---------------|-------------|--------|
| Manual local execution | GitHub Actions / Azure DevOps pipeline | Automated on every PR |
| No gate check | Quality gate (>95% pass rate to merge) | Prevent regressions |
| Full suite every time | Smart test selection based on changed files | 70% faster feedback |

**Planned Pipeline:**
```yaml
PR Created → Install → Lint → Smoke Tests → Full Suite → Report → AI Heal → Notify
```

### 4. Parallel Execution & Performance

| Current State | Enhancement | Impact |
|---------------|-------------|--------|
| Sequential execution | `--parallel 4` workers | 4x faster suite completion |
| Full UI for all steps | API setup + UI verification only | 60% reduction in execution time |
| Fixed browser | Cross-browser matrix (Chromium + Firefox + WebKit) | Broader coverage |

### 5. AI Agents Evolution

| Current State | Enhancement | Impact |
|---------------|-------------|--------|
| Placeholder JIRA client | Live MCP connection to Atlassian | Auto-generate tests from tickets |
| Pattern-based healing | LLM-powered screenshot analysis | Heal visual/layout changes |
| Manual trigger | Post-failure auto-healing in CI | Zero-touch maintenance |
| No learning | Healing history as training data | Progressively smarter fixes |

**Roadmap:**
- Vision model integration for screenshot-based locator suggestions
- Self-updating page objects when app UI changes
- Predictive flakiness detection before failures occur
- Natural language test authoring ("test that employees can create absences")

### 6. Test Coverage Expansion

| Area | Current | Target |
|------|---------|--------|
| Absence Creation | ✅ E2E covered | Add edge cases, validation |
| Absence Reason CRUD | ✅ Create covered | Add Update, Delete, Search |
| Employee Management | ✅ Create covered | Add Edit, Deactivate, Bulk |
| Reporting Module | ❌ Not covered | New feature files needed |
| Notifications | ❌ Not covered | Email/SMS verification |
| API Layer | ❌ Not covered | Contract + integration tests |

---

## Architecture Decision Records

| Decision | Rationale |
|----------|-----------|
| Cucumber over pure Playwright Test | BDD readability for non-technical stakeholders |
| Page Object Model | Maintainability at scale (100+ scenarios) |
| Externalized test data | Environment flexibility, no code changes per env |
| AI Agents as separate layer | Non-invasive, opt-in enhancement (won't break existing tests) |
| Multiple reporters | Different audiences (devs want detail, managers want trends) |

---

## Prerequisites

1. **Node.js 18+** — Runtime environment
2. **Install dependencies:** `npm install`
3. **Install browsers:** `npx playwright install chromium`
4. **Java 11+** (optional) — Only needed for Allure reports

---

## Contributing

1. Create feature files in `features/` following existing Gherkin patterns
2. Add step definitions in `stepDefinitions/`
3. Create page objects in `pageObjects/` extending `BasePage`
4. Keep smoke data in the selected environment config or feature file
5. Run `npm run report:run` to verify before pushing
