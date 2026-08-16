/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Env {
  DB: D1Database;
  FLEET_TRACKER: DurableObjectNamespace;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
}

declare namespace App {
  interface Locals {
    runtime: {
      env: Env;
    };
    user: {
      id: string;
      email: string;
      name: string;
    } | null;
    session: {
      id: string;
      expiresAt: string;
    } | null;
  }
}
