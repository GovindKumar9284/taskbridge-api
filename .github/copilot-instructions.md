# Copilot instructions for contributors

This repository will contain a ReactJS frontend scaffold for the TaskBridge assessment.

Structure to maintain:

- .github/copilot-instructions.md — guidance for Copilot and contributors
- src/ — React source code
  - models/ — data models (e.g., Task)
  - services/ — business logic and in-memory services
  - notifications/ — notification helpers
  - components/ — React components
- projects/ — project-specific artifacts
- tests/ — unit and integration tests (Jest/Testing Library)

Recommendations:
- Use create-react-app or Vite to bootstrap a full app when ready.
- Keep services pure and easily testable.
