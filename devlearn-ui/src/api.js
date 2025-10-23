// src/api.js - Enhanced Frontend API client
const API_BASE = import.meta.env.VITE_API_URL;

// Enhanced helper functions with better error handling and logging
async function fetchJson(url, method = 'GET', body = null) {
  console.log(`🔄 API Call: ${method} ${url}`);
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    console.log(`📡 Response: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data,
      ...data
    };
  } catch (error) {
    console.error('❌ API call failed:', error);
    return { 
      ok: false, 
      error: error.message,
      status: 0,
      data: null
    };
  }
}

async function fetchFormData(url, formData) {
  console.log(`🔄 File Upload: POST ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    
    console.log(`📡 Upload Response: ${response.status} ${response.statusText}`);
    const data = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    console.error('❌ Form upload failed:', error);
    return { 
      ok: false, 
      error: error.message,
      status: 0,
      data: null
    };
  }
}

export const api = {
  // Auth endpoints
  login: (credentials) => fetchJson(`${API_BASE}/auth/login`, 'POST', credentials),
  register: (userData) => fetchJson(`${API_BASE}/auth/register`, 'POST', userData),
  getMe: () => fetchJson(`${API_BASE}/me`),
  logout: () => fetchJson(`${API_BASE}/auth/logout`, 'POST'),
  refreshToken: () => fetchJson(`${API_BASE}/auth/refresh`, 'POST'),

  // Dashboard endpoints
  getDashboardSummary: () => fetchJson(`${API_BASE}/dashboard/summary`),
  getProgress: () => fetchJson(`${API_BASE}/progress`),
  updateProgress: (progress) => fetchJson(`${API_BASE}/progress`, 'PATCH', { progress }),
  getNotifications: () => fetchJson(`${API_BASE}/notifications`),
  dismissNotification: (id) => fetchJson(`${API_BASE}/notifications/${id}/dismiss`, 'PATCH'),
  markNotificationRead: (id) => fetchJson(`${API_BASE}/notifications/${id}/read`, 'POST'),
  getLecturerOverview: () => fetchJson(`${API_BASE}/dashboard/lecturer-overview`),

  // Resources endpoints
  getResources: () => fetchJson(`${API_BASE}/resources`),
  getResource: (id) => fetchJson(`${API_BASE}/resources/${id}`),
  addResource: (resource) => fetchJson(`${API_BASE}/resources`, 'POST', resource),
  updateResource: (id, updates) => fetchJson(`${API_BASE}/resources/${id}`, 'PATCH', updates),
  deleteResource: (id) => fetchJson(`${API_BASE}/resources/${id}`, 'DELETE'),

  // Upload endpoints
  uploadDocument: (formData) => fetchFormData(`${API_BASE}/resources/upload`, formData),

  // Saved resources endpoints
  getSaved: () => fetchJson(`${API_BASE}/resources/saved`),
  saveResource: (resourceId) => fetchJson(`${API_BASE}/resources/${resourceId}/save`, 'POST'),
  unsaveResource: (resourceId) => fetchJson(`${API_BASE}/resources/${resourceId}/unsave`, 'DELETE'),
  toggleSaved: (data) => fetchJson(`${API_BASE}/resources/toggle-saved`, 'POST', data),

  // Reviews endpoints
  getReviews: (resourceId) => fetchJson(`${API_BASE}/resources/${resourceId}/reviews`),
  addReview: (data) => fetchJson(`${API_BASE}/resources/${data.resourceId}/reviews`, 'POST', {
    text: data.text,
    rating: data.rating
  }),

  // Profile endpoints
  getProfile: () => fetchJson(`${API_BASE}/profile`),
  updateProfile: (updates) => fetchJson(`${API_BASE}/profile`, 'PATCH', updates),
  updateEmail: (email) => fetchJson(`${API_BASE}/profile/email`, 'PATCH', { email }),
  updatePassword: (passwords) => fetchJson(`${API_BASE}/profile/password`, 'POST', passwords),
  uploadAvatar: (formData) => fetchFormData(`${API_BASE}/profile/avatar`, formData),
  deleteAccount: () => fetchJson(`${API_BASE}/profile`, 'DELETE')
};

// Utility function for building absolute URLs
export function absUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = API_BASE.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

// Health check utility
export async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    return {
      ok: response.ok,
      data,
      online: response.ok && data.ok === true
    };
  } catch (error) {
    return {
      ok: false,
      online: false,
      error: error.message
    };
  }
}

// Export API_BASE
export { API_BASE };