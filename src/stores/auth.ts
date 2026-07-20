import { create } from 'zustand';

import { login as cognitoLogin } from '@/auth/cognito';
import { clearTokens, loadTokens, saveTokens, type StoredTokens } from '@/auth/tokens';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: Status;
  tokens: StoredTokens | null;
  /** Load persisted tokens on app start. */
  hydrate: () => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Replace tokens after a silent refresh (called by the API client). */
  setTokens: (tokens: StoredTokens) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  tokens: null,

  hydrate: async () => {
    const tokens = await loadTokens();
    set({ tokens, status: tokens ? 'authenticated' : 'unauthenticated' });
  },

  signIn: async (username, password) => {
    const tokens = await cognitoLogin(username, password);
    await saveTokens(tokens);
    set({ tokens, status: 'authenticated' });
  },

  signOut: async () => {
    await clearTokens();
    set({ tokens: null, status: 'unauthenticated' });
  },

  setTokens: (tokens) => set({ tokens }),
}));
