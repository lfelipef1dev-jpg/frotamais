import { defineMiddleware } from 'astro:middleware';
import { createAuth } from './lib/auth';
import { canAccessRoute } from './lib/permissions';

export const onRequest = defineMiddleware(async (context, next) => {
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

  const auth = createAuth(context.locals.runtime.env);
  const sessionData = await auth.api.getSession({
    headers: context.request.headers,
  });

  const userRole = (sessionData?.user as any)?.role ?? 'admin';

  context.locals.user = sessionData?.user
    ? {
        id: sessionData.user.id,
        email: sessionData.user.email,
        name: sessionData.user.name,
        role: userRole,
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

  // Check role-based access
  if (pathname.startsWith('/app/') && sessionData) {
    if (!canAccessRoute(userRole, pathname)) {
      return context.redirect('/app/dashboard');
    }
  }

  return next();
});
