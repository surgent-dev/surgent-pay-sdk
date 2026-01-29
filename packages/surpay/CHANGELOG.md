# @surgent-dev/surpay

## 0.2.0

### Minor Changes

- 809165a: Updated requirement of project ID across a lot of APIs, also deleted some unused ones.

### Patch Changes

- 809165a: Improve SDK reliability and type safety

  - Add configurable request timeouts (30s default) with AbortController
  - Catch network errors and return as Result failures instead of throwing
  - Handle invalid JSON responses gracefully
  - Add proper generics for Convex auth context (removes `any` types)
  - Fix examples and documentation to match current API
