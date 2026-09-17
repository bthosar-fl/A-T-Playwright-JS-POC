/** Smoke configuration loader shared by the runner and step definitions. */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../..');
const smokeDir = path.join(rootDir, 'Smoke-Navigation-Flow');
const supportedBrowsers = new Set(['chrome', 'edge', 'firefox', 'webkit']);

/**
 * Loads the JSON config selected by the SMOKE_CONFIG environment variable.
 * Example: SMOKE_CONFIG=aes-stage.ml.140462 loads config/aes-stage.ml.140462.json.
 * @returns {object} The selected environment configuration.
 * @throws {Error} When the config name is unsafe, missing, or cannot be found.
 */
function getConfig() {
  const name = process.env.SMOKE_CONFIG;
  if (!name || !/^[\w.-]+$/.test(name)) {
    throw new Error('Set SMOKE_CONFIG to a config name, for example: aes-stage.ml.140462');
  }

  const file = path.join(smokeDir, 'config', `${name}.json`);
  if (!fs.existsSync(file)) throw new Error(`Smoke config not found: ${file}`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/**
 * Gets the username and password for the user selected by SMOKE_USER.
 * Credentials always come from the selected smoke config; feature-file values are not used for login.
 * @returns {{username: string, password: string}} Credentials for the current smoke user.
 * @throws {Error} When the selected user has no username or password.
 */
function getCredentials(userKey) {
  const config = getConfig();
  const key = userKey || process.env.SMOKE_USER || 'org_username';

  const normalize = (v) => (typeof v === 'string' && v.trim()) ? v.trim() : undefined;

  const username = normalize(config.testUsernames?.[key]) ?? normalize(config.username);
  const password = normalize(config.testPasswords?.[key]) ?? normalize(config.password);

  const mask = (s) => (typeof s === 'string' && s.length) ? `${s[0]}${'*'.repeat(Math.max(3, s.length - 1))}` : s;
  console.log(`[Smoke] getCredentials: resolved userKey="${key}", username="${username}", password="${mask(password)}"`);

  if (!username || !password) throw new Error(`Credentials missing for smoke user: ${key}`);
  return { username, password };
}

/**
 * Selects the browser requested by SMOKE_BROWSER or the selected config.
 * @returns {'chrome'|'edge'|'firefox'|'webkit'} Supported Playwright browser name.
 * @throws {Error} When an unsupported browser name is supplied.
 */
function getBrowserName() {
  const browser = (process.env.SMOKE_BROWSER || getConfig().browser || 'chrome').toLowerCase();
  if (!supportedBrowsers.has(browser)) {
    throw new Error(`Unsupported browser: ${browser}. Use chrome, edge, firefox, or webkit.`);
  }
  return browser;
}

module.exports = { rootDir, smokeDir, getConfig, getCredentials, getBrowserName };
