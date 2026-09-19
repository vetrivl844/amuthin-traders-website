/**
 * API Client abstraction for Amuthin Traders e-commerce application.
 * Currently configured to simulate future .NET Web API / Node backend endpoints.
 * When real backend is provisioned, simply set USE_REAL_API to true and provide API_BASE_URL.
 */

export const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
export const USE_REAL_API = false;

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    if (!USE_REAL_API) {
      throw new Error(`Real backend not connected for GET ${endpoint}. Using service data layer.`);
    }
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined) url.searchParams.append(key, String(val));
      });
    }
    const res = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`API GET request failed with status ${res.status}`);
    return res.json();
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    if (!USE_REAL_API) {
      throw new Error(`Real backend not connected for POST ${endpoint}. Using service data layer.`);
    }
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API POST request failed with status ${res.status}`);
    return res.json();
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    if (!USE_REAL_API) {
      throw new Error(`Real backend not connected for PUT ${endpoint}. Using service data layer.`);
    }
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`API PUT request failed with status ${res.status}`);
    return res.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    if (!USE_REAL_API) {
      throw new Error(`Real backend not connected for DELETE ${endpoint}. Using service data layer.`);
    }
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`API DELETE request failed with status ${res.status}`);
    return res.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
