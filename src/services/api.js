import { auth } from '../firebase';

const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
const pending = new Map();

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function api(path, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new ApiError('Please log in again.', 401);
  const key = `${user.uid}:${path}`;
  const isRead = !options.method || options.method === 'GET';
  if (isRead && pending.has(key)) return pending.get(key);
  const request = performRequest(user, path, options);
  if (isRead) pending.set(key, request);
  try { return await request; }
  finally {
    if (isRead && pending.get(key) === request) pending.delete(key);
  }
}

async function performRequest(user, path, options) {
  const controller = new AbortController();
  let timer;
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new ApiError('Connection timed out. Check that the backend is running, then try again.'));
    }, 15000);
  });
  try {
    return await Promise.race([deadline, (async () => {
    const token = await user.getIdToken();
    if (controller.signal.aborted) throw new ApiError('Connection timed out. Please try again.');
    const response = await fetch(`${base}${path}`, {
    ...options,
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof data.detail === 'string' ? data.detail : 'Unable to save. Please try again.';
    if (response.status === 403 && message.startsWith('Switch to ')) {
      window.dispatchEvent(new Event('saheli-refresh-account-mode'));
    }
    throw new ApiError(message, response.status);
  }
  if (options.method && options.method !== 'GET') {
    pending.clear();
    window.dispatchEvent(new Event('saheli-data-changed'));
  }
  return data;
    })()]);
  } catch (err) {
    if (err.name === 'AbortError') throw new ApiError('Connection timed out. Check the backend and try again.');
    if (err instanceof TypeError) throw new ApiError(`Cannot connect to the Saheli backend at ${base}. Start the backend with npm run dev.`);
    throw err;
  } finally { clearTimeout(timer); }
}

export const post = (path, data = {}) => api(path, { method: 'POST', body: JSON.stringify(data) });
export const saveProfile = (data) => api('/profile', { method: 'PATCH', body: JSON.stringify(data) });
