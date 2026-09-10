import { auth } from '../firebase';

const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
const pending = new Map();

export async function api(path, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error('Please log in again.');
  const key = `${user.uid}:${path}`;
  const isRead = !options.method || options.method === 'GET';
  if (isRead && pending.has(key)) return pending.get(key);
  const request = performRequest(user, path, options);
  if (isRead) pending.set(key, request);
  try { return await request; }
  finally { if (isRead) pending.delete(key); }
}

async function performRequest(user, path, options) {
  const controller = new AbortController();
  let timer;
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error('Connection timed out. Check that the backend is running, then try again.'));
    }, 15000);
  });
  try {
    return await Promise.race([deadline, (async () => {
    const token = await user.getIdToken();
    if (controller.signal.aborted) throw new Error('Connection timed out. Please try again.');
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
  if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Unable to save. Please try again.');
  if (options.method && options.method !== 'GET') window.dispatchEvent(new Event('saheli-data-changed'));
  return data;
    })()]);
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Connection timed out. Check the backend and try again.');
    if (err instanceof TypeError) throw new Error(`Cannot connect to the Saheli backend at ${base}. Start the backend in your second VS Code terminal.`);
    throw err;
  } finally { clearTimeout(timer); }
}

export const post = (path, data = {}) => api(path, { method: 'POST', body: JSON.stringify(data) });
export const saveProfile = (data) => api('/profile', { method: 'PATCH', body: JSON.stringify(data) });
