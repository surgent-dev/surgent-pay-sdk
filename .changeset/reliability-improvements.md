---
"@surgent-dev/surpay": patch
"@surgent-dev/surpay-convex": patch
---

Improve SDK reliability and type safety

- Add configurable request timeouts (30s default) with AbortController
- Catch network errors and return as Result failures instead of throwing
- Handle invalid JSON responses gracefully
- Add proper generics for Convex auth context (removes `any` types)
- Fix examples and documentation to match current API
