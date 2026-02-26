# CLAUDE.md

This file provides guidance to AI assistants (Claude and others) when working with this repository.

## Repository Status

This repository is currently in its **initial state** — no source code, configuration files, or documentation have been committed yet. The working tree is empty and there are no prior commits.

## Git Configuration

- **Remote:** `bernadettecho-spec/bug-free-adventure`
- **Active branch:** `claude/claude-md-mm3d8907l1gjwywb-98Y3y`
- **Commit signing:** SSH-based signing is enabled

## Git Workflow Conventions

### Branch Naming
- Feature branches follow the pattern: `claude/<description>-<session-id>`
- Never push directly to `main` or `master` without explicit permission

### Commits
- Write clear, descriptive commit messages that explain *why* a change was made, not just *what* changed
- Keep commits focused and atomic — one logical change per commit
- Do not amend published commits; create new commits instead

### Pushing
- Always use `git push -u origin <branch-name>`
- Only push to the designated branch specified in your task context
- Retry on network failures with exponential backoff (2s, 4s, 8s, 16s)

## Development Setup

> This section will be updated once the project stack is established.

Once files are added to this repository, document here:
- How to install dependencies
- How to run the development server
- How to run tests
- How to run linters and formatters
- Required environment variables (use `.env.example` as reference)

## Codebase Structure

> This section will be updated as the project structure is defined.

Once source code exists, document here:
- Top-level directory layout and purpose of each directory
- Key entry points
- Module/package organization conventions

## Testing

> This section will be updated once a testing framework is chosen.

Document here:
- Test runner and framework
- How to run the full test suite
- How to run a single test file
- Where tests live relative to source files
- Code coverage requirements

## Code Style & Conventions

> This section will be updated once linting/formatting tools are configured.

Document here:
- Formatter (e.g., Prettier, Black, gofmt) and how to run it
- Linter configuration and how to run it
- Naming conventions (files, variables, functions, types)
- Import ordering rules

## Key Decisions & Architecture Notes

> Record important architectural decisions here as the project evolves.

When adding entries, include:
- The decision made
- Why it was made
- Alternatives that were considered

## Notes for AI Assistants

- This repository is empty — do not assume any particular tech stack, framework, or file structure exists until you verify with `ls` or file-reading tools
- Always read files before editing them
- Prefer editing existing files over creating new ones
- Keep changes minimal and focused on what was requested
- Do not add features, refactors, or "improvements" beyond what was explicitly asked for
- Verify that tests and linters pass after making changes (once they exist)
