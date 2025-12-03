import axios from "axios";
const BASE = import.meta.env.VITE_API_BASE;
console.log(BASE)
const http = axios.create({
  baseURL: BASE,
  withCredentials: true,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

function toProblemDetail(raw) {
  if (!raw) return { detail: "Unknown error" };
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return { detail: String(raw) };
  }
}

function makeError(err) {
  const status = err?.response?.status ?? 0;
  const data = err?.response?.data;
  const problem = toProblemDetail(data ?? err?.message ?? "Network error");
  const e = new Error(problem?.detail || err?.message || "Request failed");
  e.status = status;
  e.problem = problem;
  return e;
}

http.interceptors.response.use(
  (res) => (res.status === 204 ? null : res.data),
  (err) => {
    throw makeError(err);
  }
);

export async function apiGet(path, params) {
  return http.get(path, { params });
}

export async function apiPost(path, body) {
  return http.post(path, body ?? null);
}

export async function apiPut(path, body) {
  return http.put(path, body ?? null);
}

export async function apiDelete(path) {
  return http.delete(path);
}
