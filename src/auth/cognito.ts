import {
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ICognitoStorage,
} from 'amazon-cognito-identity-js';

import { COGNITO } from '@/lib/constants';
import type { StoredTokens } from '@/auth/tokens';

/**
 * amazon-cognito-identity-js expects a synchronous web-style Storage. We don't rely on its
 * internal persistence — tokens are extracted after each call and stored ourselves via
 * SecureStore — so an in-memory shim is sufficient and keeps auth state out of async-storage.
 */
class MemoryStorage implements ICognitoStorage {
  private store = new Map<string, string>();
  getItem = (key: string) => this.store.get(key) ?? null;
  setItem = (key: string, value: string) => void this.store.set(key, value);
  removeItem = (key: string) => void this.store.delete(key);
  clear = () => this.store.clear();
}

const userPool = new CognitoUserPool({
  UserPoolId: COGNITO.userPoolId,
  ClientId: COGNITO.clientId,
  Storage: new MemoryStorage(),
});

const cognitoUser = (username: string) => new CognitoUser({ Username: username, Pool: userPool });

function tokensFromSession(username: string, session: CognitoUserSession): StoredTokens {
  return {
    username,
    accessToken: session.getAccessToken().getJwtToken(),
    idToken: session.getIdToken().getJwtToken(),
    refreshToken: session.getRefreshToken().getToken(),
  };
}

export function login(username: string, password: string): Promise<StoredTokens> {
  const user = cognitoUser(username);
  const details = new AuthenticationDetails({ Username: username, Password: password });
  return new Promise((resolve, reject) => {
    user.authenticateUser(details, {
      onSuccess: (session) => resolve(tokensFromSession(username, session)),
      onFailure: reject,
    });
  });
}

/** Exchange a refresh token for fresh access/id tokens. */
export function refresh(
  username: string,
  refreshToken: string,
): Promise<Pick<StoredTokens, 'accessToken' | 'idToken' | 'refreshToken'>> {
  const user = cognitoUser(username);
  return new Promise((resolve, reject) => {
    user.refreshSession(new CognitoRefreshToken({ RefreshToken: refreshToken }), (err, session) => {
      if (err || !session) return reject(err ?? new Error('Refresh failed'));
      const t = tokensFromSession(username, session);
      resolve({ accessToken: t.accessToken, idToken: t.idToken, refreshToken: t.refreshToken });
    });
  });
}

/** Returns the user sub; the account still needs email confirmation (confirmSignUp). */
export function signUp(email: string, password: string): Promise<string> {
  const attributes = [new CognitoUserAttribute({ Name: 'email', Value: email })];
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributes, [], (err, result) => {
      if (err || !result) return reject(err ?? new Error('Sign up failed'));
      resolve(result.userSub);
    });
  });
}

export function confirmSignUp(username: string, code: string): Promise<void> {
  const user = cognitoUser(username);
  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err) => (err ? reject(err) : resolve()));
  });
}

export function forgotPassword(username: string): Promise<void> {
  const user = cognitoUser(username);
  return new Promise((resolve, reject) => {
    user.forgotPassword({ onSuccess: () => resolve(), onFailure: reject });
  });
}

export function confirmForgotPassword(
  username: string,
  code: string,
  newPassword: string,
): Promise<void> {
  const user = cognitoUser(username);
  return new Promise((resolve, reject) => {
    user.confirmPassword(code, newPassword, { onSuccess: () => resolve(), onFailure: reject });
  });
}
