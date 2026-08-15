# Copilot instructions for contributors

This repository will contain a React frontend scaffold for the TaskBridge assessment. The guidance below sets expectations for contributors and for Copilot-generated suggestions.

## Technology stack
- Frontend framework: React (functional components + hooks). Prefer Vite for new projects; CRA acceptable for quick starts.
- Language: TypeScript preferred. If TypeScript is not used, include JSDoc type annotations on public APIs.
- Styling: CSS / CSS Modules / Tailwind — pick one and keep it consistent across the project.
- Tooling: Node.js (v18+ recommended), npm or pnpm. Use ESLint, Prettier, Husky (pre-commit), and a dependency-audit tool (npm audit / Snyk / Dependabot).
- Testing: Jest + React Testing Library for unit and component tests. Use MSW (Mock Service Worker) for network mocking.
- Optional: Playwright or Cypress for end-to-end tests where appropriate.

## Repository layout & architecture conventions
- Top-level layout
  - .github/ — CI, Copilot instructions
  - src/
    - components/ — presentational and container React components (small, focused)
    - pages/ or routes/ — top-level route components
    - hooks/ — reusable custom hooks (use- prefix)
    - services/ — pure business logic and API clients (no direct DOM or React dependencies)
    - models/ — TypeScript interfaces/types (Task, User, etc.)
    - utils/ — small pure utility functions
    - notifications/ — centralized toasts/notification helpers
    - styles/ — global styles, tokens, variables
  - tests/ or __tests__/ — unit and integration tests mirroring src/
  - projects/ — project-specific artifacts and decisions

- Architectural rules
  - Prefer composition over inheritance. Keep components small and single-responsibility.
  - Services and utilities must be pure functions where possible and accept dependencies (e.g., fetch) to enable easy testing.
  - Separate presentation from data-fetching: use hooks/services to fetch data and pass down via props.
  - Centralize side effects (localStorage, analytics, logging) behind small adapters that can be mocked in tests.
  - Keep routing and global app state (if any) in a minimal top-level store; prefer local component state where appropriate.

## Coding standards
Naming
- Files and folders: kebab-case (e.g., task-list.tsx, src/components/task-card/)
- React components: PascalCase (TaskList, TaskCard)
- Hooks: useCamelCase (useTaskFetcher)
- Utilities / services: camelCase (taskService, formatDate)
- Types / interfaces: PascalCase (Task, User). Optional I-prefix (ITask) only if used consistently across the repo.

Type annotations
- Use TypeScript for new code. Keep types minimal and descriptive. Place shared types in src/models/.
- When using JavaScript, provide JSDoc annotations for exported functions and component props.
- Prefer discriminated unions for variant types and explicit optional fields rather than many | undefined unions.

Formatting & linting
- Use Prettier to format code. Use ESLint with recommended React + TypeScript rules (Airbnb or equivalent) and project-level overrides.
- Configure CI to run lint and format checks; fail the build on errors.

Logging
- Avoid console.log in production code. Use a lightweight logger wrapper at src/services/logger.ts that supports levels: debug, info, warn, error.
- Include contextual metadata (request id, user id) where available. Make it easy to disable or redirect logs in CI/production.
- Never log sensitive information (passwords, tokens, PII). Sanitize or redact sensitive fields before logging.

Error handling
- Fail fast and return typed errors from services. Surface user-friendly messages at the UI layer.
- Use try/catch around async operations with clear error boundaries and retry/backoff where appropriate for idempotent operations.

Commit messages
- Follow Conventional Commits: feat:, fix:, docs:, style:, refactor:, test:, chore:.
- Include concise description and, if needed, a longer body explaining why the change was made.

## Security rules
- Secrets
  - Never commit secrets (API keys, passwords, private keys). Use environment variables and .env.* files ignored by git.
  - Add a pre-commit or CI check to detect common secret patterns.

- Dependencies
  - Run dependency vulnerability scans (npm audit or Snyk) periodically and before merging dependency upgrades.
  - Prefer small, actively maintained dependencies. Avoid packages with unclear maintenance or excessive permissions.

- Data validation & sanitization
  - Validate and sanitize all data from external sources (API responses, query params, localStorage). Do not rely only on UI validation.
  - Avoid dangerouslySetInnerHTML. If rendering HTML is necessary, sanitize with a vetted library and document why the content is safe.

- CORS & CSP
  - Document recommended Content Security Policy (CSP) headers in projects/ or deployment notes. Prefer strict policies in production.
  - Restrict CORS to allowed origins in API server configurations. Avoid wildcard origins in production.

- Authentication & Authorization
  - Do not implement authentication shortcuts in production code. Keep authentication flows and tokens in secure storage (httpOnly cookies or secure storage recommended for server).
  - Enforce least privilege for API calls.

- Secure defaults
  - Fail closed: when in doubt, deny the action and surface a safe error.
  - Lock down any eval-like APIs and avoid executing remote code.

## Testing expectations
- Unit tests
  - Every service and utility should have unit tests. Keep tests small, deterministic, and fast.
  - Use Jest with clear Arrange / Act / Assert structure.

- Component tests
  - Use React Testing Library to test behavior, not implementation details. Prefer queries that resemble user interactions (getByRole, getByLabelText).

- Integration / E2E
  - Add integration tests for critical flows (create/edit/delete task, authentication flows). Use MSW to mock network responses in unit/integration tests.
  - Use Playwright or Cypress for end-to-end tests where necessary for full-browser flows.

- Test doubles & fixtures
  - Use MSW for network mocking and small fixture factories for test data. Keep fixtures minimal and focused.

- Coverage & CI
  - Aim for 80% coverage on core business logic (services/models). For UI, prioritize meaningful behavior coverage over raw percentage.
  - Run tests + lint in CI for every PR. Fail the pipeline on test or lint failures.

## PR & review guidance
- Keep PRs small and focused: one logical change per PR.
- Provide a clear description, list of changes, and any setup/migration steps.
- Include tests for new or changed behavior. Reviewers should run tests locally if unsure.
- Use draft PRs for work in progress and mark blockers clearly.

## Copilot guidance
- Copilot is allowed to suggest code, but human review is required for:
  - Security-sensitive code
  - Authentication, encryption, and input sanitation logic
  - Any code that touches secrets or cryptography
- Vet Copilot suggestions for style, correctness, and security. Ensure suggestions match repository conventions before merging.

## Miscellaneous
- Document non-obvious architecture decisions in projects/ or inline README files next to the code.
- Update this file when conventions change.

---

By following these guidelines we keep the codebase secure, consistent, and easy to contribute to. Thank you for contributing to TaskBridge.
