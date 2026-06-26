const https = require('https');
const jiraConfig = require('../config/jira-mcp.config');

class JiraClient {
  constructor() {
    this.baseUrl = jiraConfig.connection.baseUrl;
    this.email = jiraConfig.connection.email;
    this.apiToken = jiraConfig.connection.apiToken;
    this.projectKey = jiraConfig.connection.projectKey;
  }

  _getAuthHeader() {
    const credentials = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
    return `Basic ${credentials}`;
  }

  async _request(path) {
    const url = `${this.baseUrl}/rest/api/3${path}`;
    const headers = {
      Authorization: this._getAuthHeader(),
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    return new Promise((resolve, reject) => {
      const req = https.get(url, { headers }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`JIRA API error ${res.statusCode}: ${data}`));
          }
        });
      });
      req.on('error', reject);
    });
  }

  async fetchStory(issueKey) {
    const issue = await this._request(`/issue/${issueKey}`);
    return {
      key: issue.key,
      summary: issue.fields.summary,
      description: this._extractDescription(issue.fields.description),
      acceptanceCriteria: this._extractAC(issue.fields.description),
      labels: issue.fields.labels || [],
      issueType: issue.fields.issuetype?.name || 'Story'
    };
  }

  async fetchStoriesByJql(jql) {
    const encoded = encodeURIComponent(jql);
    const result = await this._request(`/search?jql=${encoded}&maxResults=10`);
    return result.issues.map((issue) => ({
      key: issue.key,
      summary: issue.fields.summary,
      description: this._extractDescription(issue.fields.description),
      acceptanceCriteria: this._extractAC(issue.fields.description),
      labels: issue.fields.labels || [],
      issueType: issue.fields.issuetype?.name || 'Story'
    }));
  }

  async fetchSprintStories() {
    const jql = `project = ${this.projectKey} AND sprint in openSprints() AND issuetype = Story`;
    return this.fetchStoriesByJql(jql);
  }

  _extractDescription(descField) {
    if (!descField) return '';
    if (typeof descField === 'string') return descField;
    return this._flattenAdf(descField);
  }

  _flattenAdf(node) {
    if (!node) return '';
    if (node.type === 'text') return node.text || '';
    if (node.content && Array.isArray(node.content)) {
      return node.content.map((child) => this._flattenAdf(child)).join('\n');
    }
    return '';
  }

  _extractAC(descField) {
    const text = this._extractDescription(descField);
    const acMatch = text.match(/acceptance\s*criteria[:\s]*\n([\s\S]*?)(?:\n\n|\n#|$)/i);
    return acMatch ? acMatch[1].trim() : '';
  }
}

module.exports = JiraClient;