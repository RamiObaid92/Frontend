const BASE = import.meta.env.VITE_API_URL || 'https://localhost:7126';

async function call(path, { method = 'GET', body, headers = {} } = {}) {
  const url = `${BASE}${path}`;
  
  const res = await fetch(url, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload.message || res.statusText);
  return payload;
}

function getApiKeyHeader(keys) {
  if (keys?.AdminKey) return { AdminKey: keys.AdminKey };
  if (keys?.UserKey) return { UserKey: keys.UserKey };
  return {};
}

export const authApi = {
  me:    () => call('/api/auth/me'),
  signIn:(data) => call('/api/auth/signin',  { method: 'POST', body: data }),
  signUp:(data) => call('/api/auth/signup',  { method: 'POST', body: data }),
  signOut:(keys) => call('/api/auth/signout', { method: 'POST', headers: getApiKeyHeader(keys) }),
};

export const projectsApi = {
  getAll: () => call('/api/projects'), 
};