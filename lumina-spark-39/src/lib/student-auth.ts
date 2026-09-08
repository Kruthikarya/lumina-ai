const TOKEN_KEY = "lumina:student-token";
const API_BASE = (import.meta.env.VITE_PROFILE_API_URL as string | undefined)?.replace(/\/$/, "") || "http://localhost:8080";

export function getStudentToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStudentToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export function clearStudentSession() {
  setStudentToken(null);
}

export function profileApiUrl(path: string) {
  return `${API_BASE}${path}`;
}

export class ProfileApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseError(res: Response) {
  try {
    const body = await res.json();
    return new ProfileApiError(res.status, body.message || body.error || res.statusText);
  } catch {
    return new ProfileApiError(res.status, res.statusText);
  }
}

export async function profileFetch(path: string, init: RequestInit = {}) {
  const token = getStudentToken();
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData) && !headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(profileApiUrl(path), { ...init, headers });
  if (res.status === 401 || res.status === 403) {
    throw new ProfileApiError(res.status, "Please sign in to manage your profile.");
  }
  if (!res.ok) throw await parseError(res);
  if (res.status === 204) return null;
  return res.json();
}

export type AuthResponse = { token: string; email: string; fullName: string };

export async function studentRegister(payload: {
  firstName: string; lastName: string; email: string; password: string; college?: string; branchYear?: string;
}): Promise<AuthResponse> {
  const data = await profileFetch("/api/auth/student/register", {
    method: "POST",
    body: JSON.stringify(payload),
  }) as AuthResponse;
  setStudentToken(data.token);
  return data;
}

export async function studentLogin(email: string, password: string): Promise<AuthResponse> {
  const data = await profileFetch("/api/auth/student/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }) as AuthResponse;
  setStudentToken(data.token);
  return data;
}
