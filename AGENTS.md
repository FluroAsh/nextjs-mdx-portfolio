## Agent skills

### Issue tracker

Issues live in GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Branch and PR workflow

One ticket, one branch, one pull request.

1. **Pick a ticket.** Take an open issue labelled `ready-for-agent` that has no assignee and whose blockers are all either closed or have an open pull request (see step 3). Assign it to yourself before writing any code.
2. **Branch from `main`.** Unless step 3 applies, update `main`, then create the branch in a new git worktree so parallel work never shares a checkout. Name it `<issue-number>-<short-slug>`, for example `4-manifest-type-and-builder`.
3. **Stack dependent work.** If the ticket is blocked by one whose pull request is open but not merged, branch from that pull request's branch, not `main`, and open your pull request against that branch so the diff shows only your ticket. Say in the body which pull request it is stacked on and that it merges after it. If the blocker has no branch yet, stop and pick another ticket. Never rebase or force-push a branch that another open pull request is stacked on without restacking the ones above it.
4. **Verify before pushing.** Run the type check, the linter and the tests the change touches. Say plainly in the PR which acceptance criteria you could not verify.
5. **Open the PR.** Push the branch and open a pull request against `main` (or the branch it is stacked on) with `Closes #<issue-number>` in the body. Keep it to the one ticket.
6. **Stop there.** Never commit to `main` and never merge a pull request. A human reviews and merges.

Commits follow the Conventional Commits style already in the history.
