# Architecture

## Directory layout

```
apps/
  web/          # Vite frontend for the driver-facing interface
  api/          # Future route, spot, and account API
packages/
  contracts/    # Shared API schemas and domain types
infra/
  docker/       # Local development container and Compose configuration
docs/           # Product and technical documentation
```

## Boundaries

- `apps/web` must consume server data through typed contracts, not direct database access.
- `apps/api` owns authentication, spot moderation, routing, and external map-provider integrations.
- `packages/contracts` holds request/response schemas and shared domain types; it must not depend on either app.
- `infra` contains environment tooling only, never application source code or credentials.

## Next technical milestones

1. Add TypeScript, linting, and component tests to `apps/web`.
2. Create `apps/api` with validated route/spot endpoints.
3. Define versioned schemas in `packages/contracts`.
4. Add provider adapters for maps, road closures, and place data behind the API.

## Local tooling

- Start the web app with `npm run dev` from the repository root.
- Start the container environment with `docker compose -f infra/docker/docker-compose.dev.yml up --build`.
