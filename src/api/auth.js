const BASE = import.meta.env.VITE_API_URL || "https://localhost:7126";

async function call(path, { method = "GET", body, headers = {} } = {}) {
  const url = `${BASE}${path}`;

  const isFormData = body instanceof FormData;

  const options = {
    method,
    credentials: "include",
    headers: { ...headers },
    body: body,
  };

  if (!isFormData && body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  } else if (isFormData) {
    delete options.headers["Content-Type"];
  }
  try {
    const res = await fetch(url, options);

    const payload =
      res.status === 204 ? {} : await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage = payload.message || payload.title || res.statusText;
      throw new Error(errorMessage);
    }

    return payload;
  } catch (error) {
    console.error(`API call error to ${path}:`, error);
    throw error;
  }
}

export const authApi = {
  me: () => call("/api/auth/me"),
  signIn: (data) => call("/api/auth/signin", { method: "POST", body: data }),
  signUp: (data) => call("/api/auth/signup", { method: "POST", body: data }),
  signOut: () => call("/api/auth/signout", { method: "POST" }),
  getAll: () => call("/api/auth/users")
};

export const projectsApi = {
  getAll: () => call("/api/projects"),

  create: (formData) =>
    call("/api/projects", { method: "POST", body: formData }),
  
};

export const clientsApi = {
  getAll: () => call("/api/Clients"),
  create: (data) => call("/api/Clients", { method: "POST", body: data }),
  update: (id, data) => call(`/api/Clients/${id}`, { method: "PUT", body: data }),
  delete: (id) => call(`/api/Clients/${id}`, { method: "DELETE" })
};

export const usersApi = {
  getAll: () => call("/api/Auth/users"),
};
