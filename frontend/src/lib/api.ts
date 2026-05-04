const API_BASE = '/api/v1';

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new ApiError(response.status, error.detail || 'Request failed');
  }

  return response.json();
}

let authToken: string | null = null;

export const api = {
  setToken: (token: string) => {
    authToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return authToken;
  },

  clearToken: () => {
    authToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  auth: {
    register: (email: string, password: string, fullName: string) =>
      request('/auth/register', { method: 'POST', body: { email, password, full_name: fullName } }),
    login: (email: string, password: string) =>
      request<{ access_token: string }>('/auth/login', { method: 'POST', body: { email, password } }),
    me: () => request('/auth/me', { token: authToken }),
  },

  content: {
    list: () => request('/content', { token: authToken }),
    generate: (topic: string, contentType: string, platforms: string[], userNiche?: string) =>
      request('/content/generate', {
        method: 'POST',
        token: authToken,
        body: { topic, content_type: contentType, platforms, user_niche: userNiche },
      }),
    get: (id: string) => request(`/content/${id}`, { token: authToken }),
    update: (id: string, data: Partial<{ title: string; description: string; status: string; scheduled_for: string }>) =>
      request(`/content/${id}`, { method: 'PUT', token: authToken, body: data }),
    delete: (id: string) => request(`/content/${id}`, { method: 'DELETE', token: authToken }),
    schedule: (id: string, platform: string, scheduledFor?: string) =>
      request(`/content/${id}/schedule`, {
        method: 'POST',
        token: authToken,
        body: { platform, scheduled_for: scheduledFor },
      }),
  },

  trends: {
    list: (platform?: string) =>
      request(`/trends${platform ? `?platform=${platform}` : ''}`, { token: authToken }),
    refresh: () =>
      request('/trends/refresh', { method: 'POST', token: authToken }),
  },

  instructions: {
    list: () => request('/instructions', { token: authToken }),
    generate: (userNiche?: string, contentTypes?: string[]) =>
      request('/instructions/generate', {
        method: 'POST',
        token: authToken,
        body: { user_niche: userNiche, content_types: contentTypes },
      }),
    markRead: (id: string) =>
      request(`/instructions/${id}/read`, { method: 'PUT', token: authToken }),
    markDone: (id: string) =>
      request(`/instructions/${id}/done`, { method: 'PUT', token: authToken }),
  },

  analytics: {
    overview: () => request('/analytics/overview', { token: authToken }),
    content: (id: string) => request(`/analytics/content/${id}`, { token: authToken }),
    platforms: () => request('/analytics/platforms', { token: authToken }),
  },

  workflows: {
    triggerTrendAlert: (trendData: unknown) =>
      request('/workflows/trigger/trend-alert', {
        method: 'POST',
        token: authToken,
        body: trendData,
      }),
    triggerPublish: (contentData: unknown) =>
      request('/workflows/trigger/publish', {
        method: 'POST',
        token: authToken,
        body: contentData,
      }),
  },
};

export { ApiError };