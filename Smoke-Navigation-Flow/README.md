# Smoke navigation flow

Run locally or in CI with `SMOKE_CONFIG=aes-stage.ml.140462 npm run smoke`.

The runner reads `config/aes-stage.ml.140462.json`, runs scenarios tagged `@140462` in `@P1`, `@P2`, and later priority order for each configured user, and writes screenshots, videos, Allure results, and the HTML Allure report to `Report/`.

Set `"video": true` in the selected config to save videos. Install dependencies first with `npm install`.
