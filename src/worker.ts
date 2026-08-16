import { createExports as baseCreateExports } from '@astrojs/cloudflare/entrypoints/server.js';
import { FleetTracker } from './lib/FleetTracker';

export { FleetTracker };

export function createExports(manifest: any) {
  const exports = baseCreateExports(manifest);
  const originalFetch = exports.default.fetch;

  return {
    default: {
      fetch: async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
        const url = new URL(request.url);

        if (url.pathname.startsWith('/api/fleet/')) {
          const objectId = env.FLEET_TRACKER.idFromName('global-fleet');
          const stub = env.FLEET_TRACKER.get(objectId);
          return stub.fetch(request);
        }

        return originalFetch(request, env, ctx);
      },
    },
    FleetTracker,
  };
}
