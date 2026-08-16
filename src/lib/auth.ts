import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDb } from '../db/client';
import * as schema from '../db/schema';

export function createAuth(env: Env) {
  const db = getDb(env.DB);
  const isProduction = env.BETTER_AUTH_URL?.startsWith('https://') ?? false;

  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      autoSignIn: true,
    },
    advanced: {
      useSecureCookies: isProduction,
      defaultCookieAttributes: {
        sameSite: 'lax',
        secure: isProduction,
      },
    },
    trustedOrigins: [
      env.BETTER_AUTH_URL,
      'http://localhost:4321',
      'http://127.0.0.1:4321',
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
