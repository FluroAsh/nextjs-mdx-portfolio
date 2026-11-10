---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Comments are rare, one-line JSDoc

Let the code carry its own meaning. Add a comment only when a reader changing that line would otherwise make the wrong call: a constraint, a non-obvious coupling, a measured value, a library gotcha.

- Write every comment as JSDoc, `/** ... */`, on a single line. Two lines only when one cannot hold the reason.
- Say why, not what. Attribute comments on object types are the one exception; see `typescript-types.md`.
- In every file you touch, delete comments that restate the code or no longer match it, and rewrite kept `//` comments as one-line JSDoc.
