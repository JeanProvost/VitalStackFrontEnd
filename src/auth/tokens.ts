import * as SecureStore from 'expo-secure-store';

/**
 * Cognito tokens persisted across launches. Stored in the device keychain/keystore.
 *
 * ponytail: SecureStore warns above ~2048 bytes per value; Cognito JWTs usually fit but
 * can exceed it on pools with many custom claims. Upgrade path: chunk the token across
 * numbered keys if that warning ever fires in practice.
 */
export interface StoredTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  username: string;
}

const KEYS: Record<keyof StoredTokens, string> = {
  accessToken: 'vs_access_token',
  idToken: 'vs_id_token',
  refreshToken: 'vs_refresh_token',
  username: 'vs_username',
};

export async function saveTokens(tokens: StoredTokens): Promise<void> {
  await Promise.all(
    (Object.keys(KEYS) as (keyof StoredTokens)[]).map((k) =>
      SecureStore.setItemAsync(KEYS[k], tokens[k]),
    ),
  );
}

export async function loadTokens(): Promise<StoredTokens | null> {
  const values = await Promise.all(
    (Object.keys(KEYS) as (keyof StoredTokens)[]).map((k) => SecureStore.getItemAsync(KEYS[k])),
  );
  if (values.some((v) => v == null)) return null;
  const [accessToken, idToken, refreshToken, username] = values as string[];
  return { accessToken, idToken, refreshToken, username };
}

export async function clearTokens(): Promise<void> {
  await Promise.all(Object.values(KEYS).map((key) => SecureStore.deleteItemAsync(key)));
}
