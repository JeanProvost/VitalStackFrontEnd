/**
 * Runtime configuration, read from EXPO_PUBLIC_* env vars (inlined at build time).
 * See .env.example. Missing values are surfaced loudly in dev rather than failing silently.
 */

function readEnv(key: string, value: string | undefined): string {
  if (!value) {
    // Trust boundary: config the app cannot function without.
    if (__DEV__) {
      console.warn(`[config] Missing ${key}. Copy .env.example to .env and fill it in.`);
    }
    return '';
  }
  return value;
}

export const API_URL = readEnv('EXPO_PUBLIC_API_URL', process.env.EXPO_PUBLIC_API_URL);

export const COGNITO = {
  userPoolId: readEnv('EXPO_PUBLIC_COGNITO_USER_POOL_ID', process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID),
  clientId: readEnv('EXPO_PUBLIC_COGNITO_CLIENT_ID', process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID),
} as const;
