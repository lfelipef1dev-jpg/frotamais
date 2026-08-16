import type { APIRoute } from 'astro';
import { createApp } from '../../server/app';

const app = createApp();

export const ALL: APIRoute = (ctx) => app.fetch(ctx.request, ctx.locals.runtime.env as Env, ctx.locals.runtime.env as any);
