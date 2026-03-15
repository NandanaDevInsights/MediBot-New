import { startGlobalLoading, stopGlobalLoading } from '../utils/LoadingContext'

// Default to Flask backend (http://localhost:5000/api). Override with VITE_API_URL in .env.local.
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = data?.message || 'Unexpected server error.'
    throw new Error(message)
  }
  return data
}

/**
 * Standardized fetch wrapper that includes global loading state management
 */
const fetchWithLoading = async (url, options = {}, { showLoader = true } = {}) => {
  if (showLoader) startGlobalLoading();
  try {
    const response = await fetch(url, options);
    return await parseResponse(response);
  } finally {
    if (showLoader) stopGlobalLoading();
  }
};

export const handleLogin = async (payload) => {
  return fetchWithLoading(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
}

export const handleAdminLogin = async (payload) => {
  return fetchWithLoading(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
}


export const verifyOtp = async (payload) => {
  return fetchWithLoading(`${API_BASE}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
}

export const handleSignup = async (payload) => {
  return fetchWithLoading(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
}

export const handleLabSignup = async (payload) => {
  return fetchWithLoading(`${API_BASE}/admin/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
}

export const handleGoogleAuth = async (token) => {
  return fetchWithLoading(`${API_BASE}/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token }),
  })
}

export const startGoogleOAuth = () => {
  window.location.href = `${API_BASE}/google/start`
}

export const requestPasswordReset = async (email) => {
  return fetchWithLoading(`${API_BASE}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
}


export const resetPassword = async (payload) => {
  return fetchWithLoading(`${API_BASE}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}


export const getUserProfile = async (options = {}) => {
  return fetchWithLoading(`${API_BASE}/profile`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }, options)
}

export const updateUserProfile = async (payload, options = {}) => {
  return fetchWithLoading(`${API_BASE}/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  }, options)
}

export const getUserReports = async (options = {}) => {
  return fetchWithLoading(`${API_BASE}/reports`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }, options)
}

export const getUserNotifications = async (options = {}) => {
  return fetchWithLoading(`${API_BASE}/user/notifications`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }, options)
}

// --- Super Admin Endpoints ---
export const getSuperAdminStats = async (options = {}) => {
  return fetchWithLoading(`${API_BASE}/super-admin/dashboard-stats`, { credentials: 'include' }, options)
}

export const getSuperAdminLabs = async (options = {}) => {
  return fetchWithLoading(`${API_BASE}/super-admin/labs-performance`, { credentials: 'include' }, options)
}

export const getSuperAdminBookings = async (options = {}) => {
  return fetchWithLoading(`${API_BASE}/super-admin/all-bookings`, { credentials: 'include' }, options)
}

export const getSuperAdminUsers = async (options = {}) => {
  return fetchWithLoading(`${API_BASE}/super-admin/all-users`, { credentials: 'include' }, options)
}

export const getSuperAdminChartData = async (options = {}) => {
  return fetchWithLoading(`${API_BASE}/super-admin/chart-data`, { credentials: 'include' }, options)
}

export const getSuperAdminNotifications = async (options = {}) => {
  return fetchWithLoading(`${API_BASE}/super-admin/notifications`, { credentials: 'include' }, options)
}

export const deleteUserRecord = async (email) => {
  return fetchWithLoading(`${API_BASE}/super-admin/delete-user`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email })
  })
}



