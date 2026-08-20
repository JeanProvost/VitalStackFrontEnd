import { refresh as cognitoRefresh } from '@/auth/cognito';
import { saveTokens, type StoredTokens } from '@/auth/tokens';
import { API_URL } from '@/lib/constants';
import { useAuthStore } from '@/stores/auth';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function readResponseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function getErrorMessage(res: Response, body: unknown): string {
  if (typeof body === 'string' && body) return body;
  if (body && typeof body === 'object' && 'message' in body) return String(body.message);
  return res.statusText || `Request failed (${res.status})`;
}

/**
 * Single entry point for every API call. Attaches the Bearer token, and on a 401 performs
 * one Cognito refresh + retry before giving up and signing the user out.
 *
 * ponytail: refresh is not single-flighted — concurrent 401s can each trigger a refresh.
 * Harmless (Cognito is idempotent here) but wasteful; add a shared in-flight promise if it
 * ever shows up in profiling.
 */
async function request<T>(path: string, init: RequestInit = {}, allowRetry = true): Promise<T> {
  const { tokens } = useAuthStore.getState();

  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (tokens?.accessToken) headers.set('Authorization', `Bearer ${tokens.accessToken}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (res.status === 401 && allowRetry && tokens?.refreshToken) {
    const refreshed = await tryRefresh(tokens);
    if (refreshed) return request<T>(path, init, false);
    await useAuthStore.getState().signOut();
    throw new ApiError(401, 'Your session has expired. Please sign in again.');
  }

  if (!res.ok) {
    const body = await readResponseBody(res);
    throw new ApiError(res.status, getErrorMessage(res, body), body);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

async function tryRefresh(tokens: StoredTokens): Promise<boolean> {
  try {
    const next = await cognitoRefresh(tokens.username, tokens.refreshToken);
    const merged: StoredTokens = { ...tokens, ...next };
    await saveTokens(merged);
    useAuthStore.getState().setTokens(merged);
    return true;
  } catch {
    return false;
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
