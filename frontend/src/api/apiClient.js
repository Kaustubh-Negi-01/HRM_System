const BASE_URL = import.meta.env.VITE_API_URL || '';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('dayflow_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('dayflow_token', token);
    } else {
      localStorage.removeItem('dayflow_token');
    }
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('dayflow_token');
    }
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        this.setToken(null);
        window.dispatchEvent(new CustomEvent('dayflow:unauthorized'));
      }

      const contentType = response.headers.get('content-type');
      let data = null;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Backend error envelope: { success:false, error:{ code, message } }
        const message =
          data?.error?.message || data?.message || `Request failed with status ${response.status}`;
        const error = new Error(message);
        error.status = response.status;
        error.code = data?.error?.code;
        error.data = data;
        throw error;
      }

      // Unwrap the backend success envelope { success:true, data } so services
      // receive the payload directly.
      if (data && typeof data === 'object' && data.success === true && 'data' in data) {
        return data.data;
      }

      return data;
    } catch (error) {
      // If server is unreachable or offline, propagate error cleanly
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const netErr = new Error('Unable to connect to the backend server. Please verify backend is running on port 5000.');
        netErr.status = 503;
        throw netErr;
      }
      throw error;
    }
  }

  get(endpoint, params = {}, options = {}) {
    let url = endpoint;
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
    return this.request(url, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
