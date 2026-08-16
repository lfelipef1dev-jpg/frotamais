import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : undefined,
});

export const { signIn, signUp, signOut, getSession } = authClient;
