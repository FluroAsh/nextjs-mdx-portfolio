---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Type attributes carry JSDoc

Every attribute of an object type gets its own `/** ... */` comment on the line above it.

- Say what the attribute holds, and its unit, format or allowed values where the name alone leaves that open: `/** Size of the stored object in bytes. */`, not `/** The bytes. */`.
- State any constraint a caller must respect (when it is `null`, what it must match, what it is derived from).
- One line where it fits; two at most.
- This is the one place a comment may say *what*. The "why, never what" rule still applies to every other comment.
- Attributes inherited through `Pick`, `Omit` or an intersection keep the comment from their source type; do not repeat it.
- A union or alias with no attributes gets one comment on the type itself when its name does not explain it.
- When you add an attribute to an existing type, annotate it, and annotate any siblings in that type that are missing a comment.
