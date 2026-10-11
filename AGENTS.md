## Agent skills

### Issue tracker

Issues live in GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Branch and PR workflow

One ticket, one branch, one pull request.

1. **Pick a ticket.** Take an open issue labelled `ready-for-agent` that has no open blockers and no assignee. Assign it to yourself before writing any code.
2. **Branch from `main`.** Update `main`, then create the branch in a new git worktree so parallel work never shares a checkout. Name it `<issue-number>-<short-slug>`, for example `4-manifest-type-and-builder`.
3. **Do not stack.** If the ticket is blocked by one that has not merged, stop and pick another. Stack on a blocker's branch only when told to.
4. **Verify before pushing.** Run the type check, the linter and the tests the change touches. Say plainly in the PR which acceptance criteria you could not verify.
5. **Open the PR.** Push the branch and open a pull request against `main` with `Closes #<issue-number>` in the body. Keep it to the one ticket.
6. **Stop there.** Never commit to `main` and never merge a pull request. A human reviews and merges.

Commits follow the Conventional Commits style already in the history.
