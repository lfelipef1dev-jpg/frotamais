import { defineMiddleware } from 'astro:middleware';
import { createAuth } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  // Skip auth for public assets and API auth routes
  const pathname = context.url.pathname;
  if (
    pathname.startsWith('/_astro') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/fleet') ||
    pathname === '/sign-in' ||
    pathname === '/sign-up' ||
    pathname === '/' ||
    pathname.startsWith('/img')
  ) {
    return next();
  }

  // Check session for all other routes
  const auth = createAuth(context.locals.runtime.env);
  const sessionData = await auth.api.getSession({
    headers: context.request.headers,
  });

  context.locals.user = sessionData?.user
    ? {
        id: sessionData.user.id,
        email: sessionData.user.email,
        name: sessionData.user.name,
      }
    : null;
  context.locals.session = sessionData?.session
    ? {
        id: sessionData.session.id,
        expiresAt: sessionData.session.expiresAt
          ? new Date(sessionData.session.expiresAt).toISOString()
          : new Date().toISOString(),
      }
    : null;

  // Protect /app/* routes
  if (pathname.startsWith('/app/') && !sessionData) {
    return context.redirect('/sign-in');
  }

  return next();
});
