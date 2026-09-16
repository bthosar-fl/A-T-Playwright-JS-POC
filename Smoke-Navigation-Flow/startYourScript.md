# Start your smoke script

## Where to write files

- Put smoke scenarios in `features/`.
- Put reusable step definitions in the root `stepDefinitions/` folder.
- Put page actions and locators in the root `pageObjects/` folder.
- Put one environment config in `config/`. Do not create a `test-data` file.

## Feature rules

Every smoke scenario needs the environment tag and one priority tag. Example:

```gherkin
@140462 @P1
Scenario: Employee can open the home page
  Given Application is open in the browser
  When User logs in using "config" and "config"
  Then User is logged in successfully and is redirected to application homepage
```

Use `@P1`, then `@P2`, then `@P3`. The runner completes all P1 scenarios before P2. Keep scenario values in the feature when they belong only to that scenario.

## Config rules

Create a config when you add a new environment or organization. Name it `<environment>.<organizationId>.json`, for example `aes-stage.ml.140462.json`.

Keep `organizationId`, `url`, `testUsernames`, and `testPasswords` in it. The config name is passed without `.json`. Leave a user name empty to skip that user.

Use `userPriorities` when users need different scenario coverage. Use `P1`, not `@P1` (both are accepted):

```json
"userPriorities": {
  "org_username": ["P1", "P2", "P3", "P4"],
  "campusUser": ["P1", "P2"],
  "employee": ["P2", "P4"],
  "substitute": ["P4"]
}
```

If `userPriorities` is not present, every configured user runs every available priority. When it is present, only listed users run. A listed priority must exist with the config's organization tag in a feature file.

Set `"video": true` only when you need videos; otherwise keep it `false`.

Set `"browser": "chrome"` for the default browser. You can override it at run time with `SMOKE_BROWSER`. Supported values are `chrome`, `edge`, `firefox`, and `webkit` (Safari engine). Set `"headless": false` to see the browser locally; Chrome and Edge open maximized.

## Run locally

Install once:

```powershell
npm install
```

Run a config:

```powershell
$env:SMOKE_CONFIG = "aes-stage.ml.140462"
$env:SMOKE_BROWSER = "firefox" # Optional: chrome, edge, firefox, or webkit
$env:SMOKE_HEADLESS = "true" # Optional: use this in CI to hide the browser
npm run smoke
```

The report is created in `Report/<config name>/<run time>/`.

## Run in CI/CD

Set the pipeline environment variable `SMOKE_CONFIG` to `aes-stage.ml.140462`. Optionally set `SMOKE_BROWSER` to `chrome`, `edge`, `firefox`, or `webkit`, then run:

```text
npm ci
npm run smoke
```

Publish the generated `Smoke-Navigation-Flow/Report/` folder as the pipeline artifact.
