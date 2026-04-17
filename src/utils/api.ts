const BASE = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:5000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).error ?? `Erreur ${res.status}`);
  }
  return res.json();
}

export function apiGet<T>(path: string): Promise<T> {
  return fetch(`${BASE}${path}`).then(handleResponse<T>);
}

export function apiPost<T>(path: string, data: unknown): Promise<T> {
  return fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse<T>);
}

export function apiPatch<T>(path: string, data: unknown): Promise<T> {
  return fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse<T>);
}
