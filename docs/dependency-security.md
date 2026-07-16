# Dependency Security Baseline

## Audit date
2026-07-17

## Command used

```bash
npm audit
Current finding
Severity: Moderate
Package: postcss
Advisory: Unescaped </> in CSS stringification output
Dependency path: next depends on vulnerable postcss versions.
Reported count: 2 moderate vulnerabilities.
Decision

No automatic forced upgrade was applied.

npm audit fix --force proposes a major Next.js upgrade. A major framework upgrade can introduce breaking changes, so it must be handled in a dedicated update task with build, lint, and authentication regression testing.

Mitigation
Keep the current application dependencies locked through package-lock.json.
Run npm audit before each release and during dependency update work.
Review the Next.js release notes and upgrade in a dedicated branch when a compatible patched version is available.
Verify with npm run lint, npm run build, and the sign-in/onboarding flow after any framework upgrade.
Acceptance criteria
The audit result is documented.
No unsafe forced dependency upgrade is merged.
Future dependency updates have an explicit verification checklist.