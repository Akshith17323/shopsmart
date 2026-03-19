# ShopSmart DevOps Documentation

This document addresses **Step 11: Explanation** of the project rubric.

## Architecture
ShopSmart uses a decoupled **Client-Server Architecture**:
- **Frontend**: A React single-page application (SPA) built with Vite, providing a highly responsive, modern component-based UI.
- **Backend**: A Node.js/Express REST API serving product data via a stateless architecture, ensuring fast and scalable client requests.

## Workflow
Our DevOps workflow is heavily automated to ensure continuous integration:
1. **Triggers**: Pushing to `main` or `testing` triggers separate, isolated GitHub Actions (`unit-test.yml` and `integration-test.yml`).
2. **Parallel Testing**: The pipeline provisions Node 20 environments, runs static analysis (ESLint), tests components locally, and runs simulated MSW integration tests.
3. **Deployment**: Pushing to the deployment branch triggers an automated SSH connection using GitHub secrets to safely deploy the application natively into an AWS EC2 instance running Nginx. 

## Design Decisions
1. **Multi-Job Workflows**: We separated backend and frontend unit tests into mutually exclusive parallel jobs. This prevents one failed environment from blocking diagnostic output in the other.
2. **Idempotency**: All bash scripting uses idempotent flags (e.g., `mkdir -p ~/.ssh`) so the deployment runner never hits fatal errors if directories already exist.
3. **Mock Service Worker (MSW)**: Rather than requiring a heavy test database, we used MSW to intercept frontend network requests, safely verifying cross-module integration natively in the test suite.

## Challenges
1. **GitHub Artifact Dependencies**: The runner required explicit configurations for monorepo package-lock caching to function properly to avoid fatal node setup crashes.
2. **Test Timeouts in CI**: Standard React runners like Vitest default to block-watching the file system. We resolved pipeline hangs by securely ensuring `CI: true` is set the deployment environments to force deterministic execution.
