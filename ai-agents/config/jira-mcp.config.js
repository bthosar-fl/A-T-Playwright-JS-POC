module.exports = {
  server: {
    name: 'jira-mcp',
    transport: 'stdio',
    command: 'npx',
    args: ['-y', '@anthropic/jira-mcp-server']
  },
  connection: {
    baseUrl: process.env.JIRA_BASE_URL || 'https://your-org.atlassian.net',
    email: process.env.JIRA_EMAIL || '',
    apiToken: process.env.JIRA_API_TOKEN || '',
    projectKey: process.env.JIRA_PROJECT_KEY || 'HCMAT'
  }
};
