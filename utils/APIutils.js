// API Utilities
// Helper functions for API testing and test setup via API

/**
 * Make a GET request and return JSON response
 */
async function apiGet(request, url, headers = {}) {
  const response = await request.get(url, { headers });
  return {
    status: response.status(),
    body: await response.json().catch(() => null),
    headers: response.headers()
  };
}

/**
 * Make a POST request with JSON body
 */
async function apiPost(request, url, data, headers = {}) {
  const response = await request.post(url, {
    data,
    headers: { 'Content-Type': 'application/json', ...headers }
  });
  return {
    status: response.status(),
    body: await response.json().catch(() => null),
    headers: response.headers()
  };
}

/**
 * Make a PUT request with JSON body
 */
async function apiPut(request, url, data, headers = {}) {
  const response = await request.put(url, {
    data,
    headers: { 'Content-Type': 'application/json', ...headers }
  });
  return {
    status: response.status(),
    body: await response.json().catch(() => null),
    headers: response.headers()
  };
}

/**
 * Make a DELETE request
 */
async function apiDelete(request, url, headers = {}) {
  const response = await request.delete(url, { headers });
  return {
    status: response.status(),
    body: await response.json().catch(() => null)
  };
}

/**
 * Get auth token via login API (basic auth flow)
 */
async function getAuthToken(request, loginUrl, credentials) {
  const response = await apiPost(request, loginUrl, credentials);
  if (response.status !== 200) {
    throw new Error(`Auth failed with status ${response.status}`);
  }
  return response.body.token || response.body.access_token;
}

/**
 * Create authenticated headers object
 */
function authHeaders(token, extra = {}) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...extra
  };
}

/**
 * Intercept and mock an API response
 */
async function mockApiResponse(page, urlPattern, mockData, statusCode = 200) {
  await page.route(urlPattern, (route) => {
    route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify(mockData)
    });
  });
}

/**
 * Intercept and block specific API calls
 */
async function blockApiCall(page, urlPattern) {
  await page.route(urlPattern, (route) => route.abort());
}

/**
 * Wait for a specific API call and capture its response
 */
async function captureApiResponse(page, urlPattern, action) {
  const [response] = await Promise.all([
    page.waitForResponse((resp) => resp.url().includes(urlPattern)),
    action()
  ]);
  return {
    status: response.status(),
    body: await response.json().catch(() => null),
    url: response.url()
  };
}

/**
 * Wait for a specific API request and capture its payload
 */
async function captureApiRequest(page, urlPattern, action) {
  const [request] = await Promise.all([
    page.waitForRequest((req) => req.url().includes(urlPattern)),
    action()
  ]);
  return {
    method: request.method(),
    url: request.url(),
    body: request.postDataJSON()
  };
}

module.exports = {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  getAuthToken,
  authHeaders,
  mockApiResponse,
  blockApiCall,
  captureApiResponse,
  captureApiRequest
};
