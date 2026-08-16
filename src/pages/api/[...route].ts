import type { APIRoute } from 'astro';
import { createApp } from '../../server/app';

const app = createApp();

export const GET: APIRoute = (ctx) => app.fetch(ctx.request);
export const POST: APIRoute = (ctx) => app.fetch(ctx.request);
