module.exports = {
  planner: {
    enabled: true,
    jiraMcp: './jira-mcp.config.js',
    outputDir: '../planner/output',
    promptFile: './prompts/planner.prompt.md'
  },
  generator: {
    enabled: true,
    featuresDir: '../../features',
    stepDefsDir: '../../features/stepDefinitions',
    pageObjectsDir: '../../pageObjects',
    outputDir: '../generator/output',
    promptFile: './prompts/generator.prompt.md'
  },
  healer: {
    enabled: true,
    reportsDir: '../../reports',
    screenshotsDir: '../../screenshots',
    pageObjectsDir: '../../pageObjects',
    stepDefsDir: '../../features/stepDefinitions',
    maxRetries: 2,
    promptFile: './prompts/healer.prompt.md'
  }
};
