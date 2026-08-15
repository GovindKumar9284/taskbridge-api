# GitHub Copilot Instructions for TaskBridge repository

Technology stack
- Runtime: Node.js (ESM)
- Web framework: Express
- Database: Knex.js (SQL) with Objection.js ORM for model layering
- Test: Jest + Supertest
- Logging: Winston
- Linting: ESLint

Architecture conventions
- Multi-service monorepo layout: each service under src/<service-name>/ with clear layers: model -> repository -> service -> controller -> routes
- Each service must expose a programmatic interface for integration testing and a dedicated HTTP API server for production
- Configuration via environment variables, loaded through dotenv
- Use Knex migrations/seeds for schema management

Coding standards
- Use ESM modules (package.json type=module). Prefer named exports for library modules, default export for servers where appropriate.
- Write clear JSDoc comments for public functions. Prefer explicit error classes over throwing raw Error.
- Keep functions small and single-responsibility. Use async/await for async control flow.
- Include unit and integration tests with Jest and Supertest. Aim >80% coverage for new services.

Security rules (multi-tenant B2B SaaS)
- Authentication: All HTTP routes must require a valid JWT. Token must contain `sub` (user id) and `orgId` (organization id).
- Authorization: Every data access must be tenant-aware: queries must filter by orgId. Never rely on client-supplied org identifiers without cross-checking JWT.
- Data exposure: Never return fields that belong to other tenants. Sanitize output shapes and never leak internal server errors to clients.
- Sensitive data handling: PII and IP addresses must be stored encrypted at rest in production (note: for assessment, document as constraint).
- Audit logging: All write operations must create immutable audit entries indicating actor id, org id, timestamp, and delta. Audit entries must be append-only.
- Rate limiting: Public APIs should be behind rate limits (e.g., API gateway). Services must validate input sizes to mitigate DoS.

Testing expectations
- Unit tests for services/repositories mocking DB interactions.
- Integration tests using an in-memory or ephemeral SQLite instance via Knex for end-to-end flows.
- Tests must include tenant-isolation checks (user from org A cannot access org B's data).

Copilot usage policy for this repo
- Save all Copilot prompts and outputs in PROMPTS_RAW.txt and PROMPTS.md under repo root for audit.
- Treat AI-generated code as untrusted until reviewed: ALWAYS create a REVIEW.md describing what was accepted, what was changed, and why.

