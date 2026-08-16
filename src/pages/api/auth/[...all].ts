import type { APIRoute } from 'astro';
import { createAuth } from '../../../lib/auth';

export const prerender = false;

export const ALL: APIRoute = async (context) => {
  const auth = createAuth(context.locals.runtime.env);
  return auth.handler(context.request);
};
