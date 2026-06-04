# Quick Start – Test Execution Guide

## Prerequisites

1. **Node.js 18+** installed → [Download](https://nodejs.org/)
2. Run once after cloning:
   ```powershell
   npm install
   npx playwright install chromium
   ```

---

## Run Tests & View Report

```powershell
npm run report:run
```

This single command will:
- Execute all test scenarios
- Generate the HTML report
- Open the report in your browser automatically

---

## Run Tests Only (without report)

```powershell
npx cucumber-js features/createAbsence.feature
```
