/** Entry point for a config-driven smoke run. */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { rootDir, smokeDir, getConfig } = require('./navigationSmokeRuntime');
const cucumberCli = path.join(path.dirname(require.resolve('@cucumber/cucumber')), '..', 'bin', 'cucumber.js');

/**
 * Finds every .feature file in the smoke features folder and its subfolders.
 * @param {string} dir Folder to search.
 * @returns {string[]} Absolute feature-file paths.
 */
function featureFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? featureFiles(file) : entry.name.endsWith('.feature') ? [file] : [];
  });
}

/**
 * Collects priority tags that belong to the selected environment and sorts them P1, P2, ... Pn.
 * @param {string[]} files Feature files to inspect.
 * @param {string} environmentTag Environment tag, for example @140462.
 * @returns {string[]} Ordered priority tags.
 */
function priorities(files, environmentTag) {
  const tags = files.flatMap((file) => fs.readFileSync(file, 'utf8').match(/@P\d+/g) || []);
  return [...new Set(tags)].sort((a, b) => Number(a.slice(2)) - Number(b.slice(2))).filter(Boolean)
    .filter((tag) => files.some((file) => new RegExp(`${environmentTag}[\\s\\S]*${tag}|${tag}[\\s\\S]*${environmentTag}`).test(fs.readFileSync(file, 'utf8'))));
}

/**
 * Selects the priority tags allowed for one user.
 * Config values use P1/P2 notation; the runner converts them to Cucumber tags (@P1/@P2).
 * If userPriorities is absent, the user runs every priority. When it exists, users not listed are skipped.
 * @param {object} config Selected environment config.
 * @param {string} userKey Key in testUsernames.
 * @param {string[]} availablePriorities Priority tags found in the feature files.
 * @returns {string[]} Ordered priority tags for this user.
 * @throws {Error} When the config requests a priority that has no matching environment scenario.
 */
function prioritiesForUser(config, userKey, availablePriorities) {
  if (!config.userPriorities) return availablePriorities;
  const requested = config.userPriorities?.[userKey];
  if (!requested) return [];

  const requestedTags = requested.map((priority) => priority.startsWith('@') ? priority : `@${priority}`);
  const missing = requestedTags.filter((priority) => !availablePriorities.includes(priority));
  if (missing.length) {
    throw new Error(`${userKey} requests unavailable priority tags: ${missing.join(', ')}`);
  }
  return availablePriorities.filter((priority) => requestedTags.includes(priority));
}

/**
 * Runs one priority group for one configured user.
 * The config selects the environment tag; the user and artifact paths are passed to Cucumber as environment variables.
 * @param {object} config Selected environment config.
 * @param {string} userKey Key in testUsernames, for example employee.
 * @param {string} priority Priority tag, for example @P1.
 * @param {string} reportDir Current run's report folder.
 * @param {boolean} isLastPriority Whether this is the user's final priority group.
 * @returns {boolean} True when Cucumber completes successfully.
 */
function run(config, userKey, priority, reportDir, isLastPriority) {
  const args = [
    cucumberCli,
    ...featureFiles(path.join(smokeDir, 'features')),
    '--config', 'Smoke-Navigation-Flow/cucumber.js',
    '--format', 'progress',
    '--format', 'allure-cucumberjs/reporter',
    '--format-options', JSON.stringify({ resultsDir: path.join(reportDir, 'allure-results') }),
    '--order', 'defined',
    '--tags', `${priority} and @${config.organizationId}`
  ];
  const result = spawnSync(process.execPath, args, {
    cwd: rootDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      SMOKE_USER: userKey,
      SMOKE_REPORT_DIR: reportDir,
      SMOKE_VIDEO: String(Boolean(config.video)),
      SMOKE_LAST_PRIORITY: String(isLastPriority)
    }
  });
  return result.status === 0;
}

/**
 * Runs Cucumber once for multiple priorities for a single user.
 * @param {object} config
 * @param {string} userKey
 * @param {string[]} prioritiesArr e.g. ['@P1','@P2']
 */
function runMultiplePriorities(config, userKey, prioritiesArr, reportDir, isLastPriority) {
  const prioritiesExpr = prioritiesArr.length > 1 ? `(${prioritiesArr.join(' or ')})` : prioritiesArr[0];
  const args = [
    cucumberCli,
    ...featureFiles(path.join(smokeDir, 'features')),
    '--config', 'Smoke-Navigation-Flow/cucumber.js',
    '--format', 'progress',
    '--format', 'allure-cucumberjs/reporter',
    '--format-options', JSON.stringify({ resultsDir: path.join(reportDir, 'allure-results') }),
    '--order', 'defined',
    '--tags', `${prioritiesExpr} and @${config.organizationId}`
  ];
  console.log(`[Smoke] Running combined priorities for ${userKey}: ${prioritiesExpr}`);
  const result = spawnSync(process.execPath, args, {
    cwd: rootDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      SMOKE_USER: userKey,
      SMOKE_REPORT_DIR: reportDir,
      SMOKE_VIDEO: String(Boolean(config.video)),
      SMOKE_LAST_PRIORITY: String(isLastPriority)
    }
  });
  return result.status === 0;
}

/**
 * Converts Allure result files into a browsable HTML report.
 * @param {string} reportDir Current run's report folder.
 * @returns {boolean} True when the report is generated.
 */
function generateReport(reportDir) {
  const result = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', [
    'allure', 'generate', path.join(reportDir, 'allure-results'), '--clean', '-o', path.join(reportDir, 'allure-report')
  ], { cwd: rootDir, stdio: 'inherit' });
  return result.status === 0;
}

const config = getConfig();
const configName = process.env.SMOKE_CONFIG;
const runId = new Date().toISOString().replace(/[:.]/g, '-');
const reportDir = path.join(smokeDir, 'Report', configName, runId);
const files = featureFiles(path.join(smokeDir, 'features'));
const orderedPriorities = priorities(files, `@${config.organizationId}`);
let users = Object.entries(config.testUsernames || {}).filter(([, username]) => username);

// Support a single-user smoke run to avoid spawning multiple Cucumber processes
// Set SMOKE_SINGLE_USER=true and provide SMOKE_USER to run only that user's priorities.
if (process.env.SMOKE_SINGLE_USER === 'true') {
  const single = process.env.SMOKE_USER;
  if (!single) throw new Error('SMOKE_SINGLE_USER=true requires SMOKE_USER to be set to a testUsernames key.');
  if (!Object.prototype.hasOwnProperty.call(config.testUsernames || {}, single) || !config.testUsernames[single]) {
    throw new Error(`SMOKE_USER="${single}" is not defined in config.testUsernames or has no username.`);
  }
  users = [[single, config.testUsernames[single]]];
  console.log(`[Smoke] Running single-user mode for: ${single}`);
}

if (!orderedPriorities.length) throw new Error(`No @${config.organizationId} scenarios with @P tags were found.`);
fs.mkdirSync(reportDir, { recursive: true });

let success = true;
for (const [userKey] of users) {
  const userPriorities = prioritiesForUser(config, userKey, orderedPriorities);
  if (process.env.SMOKE_SINGLE_USER === 'true') {
    // Run all allowed priorities in a single Cucumber invocation to avoid multiple browser launches
    success = runMultiplePriorities(config, userKey, userPriorities, reportDir, true) && success;
  } else {
    for (const [index, priority] of userPriorities.entries()) {
      success = run(config, userKey, priority, reportDir, index === userPriorities.length - 1) && success;
    }
  }
}
success = generateReport(reportDir) && success;
process.exitCode = success ? 0 : 1;
