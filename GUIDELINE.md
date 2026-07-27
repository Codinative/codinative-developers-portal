# Developer Guide — the Codinative BigCommerce theme-customization process

This is the full guide to working on a theme with the `.claude/` process kit and Claude Code.
The [README](README.md) is the 30-second quick-start; this document is how you actually get
consistent, high-quality, professional results out of it, day to day.

Read it once before your first project. After that, the process runs itself — the rules surface
automatically and Claude follows them; your job is to give clear tasks, run the checks only a
human can, get your work reviewed via PR, and approve the git/deploy steps.

> **📦 The process repo:** `<ADD THE KIT REPO URL HERE>`
> Clone it (see the README) to use the kit, and browse the latest rules and this guide there.

---

## 1. The mental model (read this first)

There are **two actors**, and the whole process is built on the split between them:

- **You, the developer — the decision-maker and a quality gate.** You choose what to build, you
  run the checks a machine can't (visual, cart/checkout, Lighthouse), you get your work reviewed
  by your pair, and you approve every state-changing git/deploy step.
- **Claude — the executor and advisor, consent-gated.** It implements to the standards, runs the
  machine checks, and *proposes* each git step — but it never commits, merges, tags, pushes,
  deploys, or touches credentials on its own.

The one-line rule: **Claude proposes, you approve.** And its companion: **quality is enforced
twice** — by the machine (lint + the Definition of Done) and by a human (your paired PR reviewer).

Why this exists: the `.claude/` kit encodes the Codinative standard (structure, CSS/HTML/JS
rules, accessibility, SEO, performance, git hygiene, QA) as machine-readable rules that surface
automatically — so every codebase we touch looks and behaves like one team built it.

---

## 2. Prerequisites — a properly set-up theme

The kit assumes a **working Stencil theme dev environment**. These are **your** responsibility —
Claude flags what's missing at Day-0 but will not install tooling or touch credentials for you.

| Prerequisite | Why | Check |
|---|---|---|
| **Node** at the theme's version | Everything runs on it | `.nvmrc` present → `nvm use`; matches `package.json` `engines` |
| **Stencil CLI** (theme-compatible) | preview, bundle, push | `stencil --version`; install: `npm install -g @bigcommerce/stencil-cli` |
| **A git repo** | git is the record of every change | `git status` works; if not, `git init` |
| **`npm install` run** | lint/build need `node_modules` | `node_modules/` exists |
| **`stencil init` run** | creates `secrets.stencil.json` (your personal API token) for `stencil start` | file exists, and is gitignored |
| **The kit copied in** | the process itself | `.claude/`, `scripts/`, `CLAUDE.md`, `.stylelintrc.json`, `.stylelintignore`, `.eslintrc.json` present |

> **Security, non-negotiable:** `secrets.stencil.json`, `.stencil`, and `.env` are **credentials**
> — never committed, and Claude will never read or write them. `stencil init` is always something
> **you** run with your own Themes-scoped token.

---

## 3. Assumptions the docs make

- **A BigCommerce Stencil theme** — Handlebars templates, SCSS using the theme's `stencil*`
  helpers, Stencil's page-class JS system.
- **Fork-and-own** — edit stock files **in place**; add new code as **page-grouped components**;
  no `custom/` override tree. (See `philosophy-and-structure.md`.)
- **Git is the change record** — one baseline tag per project + focused, conventional commits.
- **Two quality gates** — the machine (lint + DoD) and a **human PR reviewer** (your pair). There
  is no unreviewed path to `main`.
- **The lint stack is wired** — Stylelint + ESLint via the kit's configs and the `npm run` scripts.
- **The theme's existing design system is the source of truth for styling** — never off-system
  magic values unless you explicitly decide otherwise.

If your project can't meet an assumption, tell Claude — it adapts and flags the gap rather than pretend.

---

## 4. Day 0 — first-time setup on a project

Do this **once per project**, before any feature work. *Nobody writes feature code until Day-0
is done.*

1. **Get the kit and copy it in** — clone the process repo, then copy the kit file set into the
   theme repo (see the [README](README.md) for the exact commands).
2. **Open the theme in Claude Code and say:** *"Run the Day-0 setup."*
3. Claude runs `npm run day0` — the **safe, mechanical** wiring: merges the lint npm scripts +
   devDependencies into `package.json`, stamps the measured `!important` baseline, fills the theme
   identity into `CLAUDE.md`, creates `.nvmrc`. It then **reports the steps that are yours** and
   walks you through them.
4. **You run / approve** (Claude proposes; you decide):
   - `npm install` — **you run it** (pulls the lint deps Day-0 declared).
   - **Tag the baseline** — Claude proposes `git tag base-theme-v<version>`; you approve. Must be
     **before any customization**, so "what did we change?" is always a clean diff.
   - **Record the branch-flow choice** and **`stencil init`** (you run it — credential).
5. **Fill-ins** Claude completes with you: the layout map in `philosophy-and-structure.md`, and the
   `!important` per-file breakdown + count in `important-baseline.md`.

When Claude reports **"Day-0 complete,"** you're ready to build.

---

## 5. Giving Claude a task

Describe the outcome in plain language — you don't need to cite rules; they surface automatically.

> **Always do tasks on a feature branch.** Every task runs on a `feat/` / `fix/` / `refactor/` /
> `chore/` branch, created at the **start** of the task (Claude proposes `git checkout -b …`
> before it edits anything). Working directly on `main` is **only** for the recorded
> direct-to-main early-build-out exception (§13) — otherwise a feature branch is required. It's
> also what makes the PR pair-review possible (§10): no branch, no PR.

**Good task prompts are specific about intent:**
- *"Add a 'Why choose us' section to the home page: three icon+text columns, using the theme's
  card styles, below the hero."*
- *"The mobile menu doesn't close when you tap a link — fix it."*
- *"Match this Figma section on the product page"* (share the design reference).

**What Claude does automatically:**
- **Classifies** — Type A (modify existing → edit the stock file in place) vs Type B (new →
  page-grouped component), reusing the closest existing page folder.
- **Asks when genuinely ambiguous** — which page a component belongs to, or brand *content* vs
  code *identifier*.
- **Applies the standards for every file it touches** — the matching rule surfaces on each edit.
- **Asks before any state-changing git** — e.g. creating the feature branch.

One task per conversation where practical keeps context lean and the diff focused.

---

## 6. Making sure Claude follows the docs

Adherence is mostly automatic — `CLAUDE.md` is always loaded, the rules are **path-scoped**
(editing `.scss` surfaces `css.md`; `.html` surfaces `html.md` + `seo.md`), and the lint gates are
hard.

**Always run Claude in "Edit Automatically" mode** (auto-accept edits) **+ the read-only Bash
allowlist** shipped in `.claude/settings.json`. This is the team standard: file edits flow without
click-approving each one, while **every git/deploy command still prompts you**. Never use full
"Auto/bypass" mode — it removes the hard stop on git (see §13).

**If Claude ever seems to skip a standard** (e.g. reports "done" after only applying HTML/CSS
rules): ask it to *"walk the full Definition of Done and report each category."*

---

## 7. QA — the Definition of Done

"Done" is a checklist, not a feeling. At the end of every task Claude **walks the full DoD in
`qa.md` and reports each category** — passed / failed / needs-your-eyes:

1. **Build & lint** — Stylelint, ESLint, `npm run check:important`, theme builds.
2. **Responsive** — the five viewports (320px → ≥1920px).
3. **Functional** — realistic data (long names, empty states, out-of-stock, guest vs logged-in).
4. **Cart/checkout smoke test** — mandatory for anything touching header, product, cart, or global code.
5. **Page Builder** — uploads cleanly, settings apply, all theme variations.
6. **SEO** · 7. **Accessibility** · 8. **Performance (Lighthouse)**.
9. **Commit** — the terminal step (§9).

**Never accept a blanket "done."** A proper report tells you exactly what Claude verified and
what it's handing to you.

---

## 8. Handling checks Claude can't run (expected, not a failure)

Claude **cannot** see rendered pixels, click through cart/checkout, or run Lighthouse against your
store. It will **say so explicitly** and hand those to you. The loop:

1. Claude implements + runs machine checks + reports the DoD, flagging the human-only items.
2. **You run them** — the five viewports, add-to-cart → cart → checkout, Lighthouse on the page type.
3. **If something's wrong**, tell Claude → it fixes → you re-verify.
4. When the human checks pass, the task is verifiable-done and ready to commit.

---

## 9. Marking a task complete

A task ends **verified and committed to the feature branch** — and the commit is **gated**:

- The commit happens **only after every DoD category has passed**, including the human checks.
- Claude **proposes** the commit (conventional message, explicit `git add <files>`, focused diff);
  you approve. You may commit now, or **defer to batch several finished tasks into one commit**.
- **A task never touches `CHANGELOG.md`, the `config.json` version, tags, or `main`** — those are
  release-time (§11).

Getting a feature to `main` is the next step, and it goes through review (§10) — not a direct merge.

---

## 10. Code review via pull request (pair review)

**Every feature reaches `main` through a GitHub pull request reviewed by your paired teammate —
never a direct merge.** The team works in **pairs who review each other's work**; the second set
of eyes on the diff, against the standards, is how we keep quality and rule-adherence honest.

The flow:
1. Get the feature to a verified, committed state on its branch (§9).
2. Push the branch to the remote (Claude proposes `git push`; you consent).
3. Open a PR into `main` — Claude can run `gh pr create` on your consent, or open it in the GitHub UI.
4. **Your paired reviewer** reviews the diff — structure (Type A/B), the DoD, the standards — and
   requests changes or approves. Address feedback on the branch; re-request review.
5. On approval, **merge via the PR**. **Never** bypass it with a local `git merge` into `main`.
6. Delete or keep the branch (Claude asks; §12).

> **📺 PR flow tutorial — `<ADD LINK / STEP-BY-STEP HERE>`**
> _Placeholder: our exact PR + pair-review process — opening the PR, assigning the paired
> reviewer, the review checklist, merge/squash settings, and branch cleanup. Fill this in._

---

## 11. Creating a release (developer-driven, from `main`)

A release is **not** per-task — it bundles everything since the last release. Rules:

- **Releases are cut from `main`** — from the state where the reviewed PRs have already merged.
- **Never release from a feature branch** unless it is **explicitly required and a senior has
  approved it first** (see §13). This is a rare, deliberate exception, not a shortcut.

When ready, tell Claude *"Let's cut a release."* It walks this **in order**, proposing each step
and running it only on your consent:

1. Confirm the reviewed features are merged into `main` (via their PRs — §10).
2. **Bump `config.json`** — `version` (semver) **and** `name` (`[project]-v[version]-[date]`).
3. **One combined `CHANGELOG.md` entry** covering all changes since the last release, in the
   file's existing pattern.
4. **Commit** the release prep. 5. **Tag** and push. 6. **`stencil bundle` → verify →
   `stencil push`** (or the deploy pipeline). 7. **Branch cleanup** (delete/keep, per branch).

Every version then maps to an exact commit; rollback = re-push the previous tag's bundle.

---

## 12. Git & consent — quick reference

- **Read-only is free** (`git status/diff/log/show`, listing branches/tags). **Everything
  state-changing is gated** — branch, add, commit, push, tag, and any deploy. Consent is **per
  command**.
- **Feature branches** are the default; they reach `main` **only via a reviewed PR** (§10).
- **A feature branch may be pushed to the remote with your consent** (multi-day work, PRs, backup).
- **The baseline tag is sacred** — one per project, tagged at Day 0, never skipped, never rewritten.

---

## 13. Hard rules — NEVER do these (they break the process)

These are non-negotiable. Breaking any one undermines the standard the whole kit exists to enforce.

- **NEVER cut a release from a feature branch** unless it is **explicitly required and a senior has
  approved it first.** Releases are cut from `main`; a feature-branch release is a rare, deliberate,
  senior-gated exception — never a shortcut.
- **NEVER merge a feature branch directly into `main`.** Every change reaches `main` through a
  **pull request reviewed by your pair** (§10). No local `git merge` into `main`.
- **NEVER change the process yourself.** Do **not** edit the `.claude/` rules, `CLAUDE.md`, the
  scripts, or the lint configs in a project. Found a mistake, gap, or improvement? **Post it in
  Discord `#suggestion-hub`** and discuss with the team — the process is improved in **one place**
  (the kit repo, via PR) and copied everywhere. Editing it per-project silently forks the standard
  and destroys consistency.
- **ALWAYS run Claude in "Edit Automatically" mode** + the read-only allowlist. **Never** full
  "Auto/bypass" (it drops the git safety gate), and don't disable the consent prompts on
  state-changing commands.
- **NEVER accept "done" on unverified work** — no commit while any DoD category is pending or
  failing, and never a blanket "done" that skips SEO / a11y / performance / cart checks.
- **NEVER put `CHANGELOG.md`, a `config.json` version bump, a tag, or a merge into a per-task
  commit** — those are release-time only.
- **NEVER skip or rewrite the baseline tag**, and never bypass it (`git add .`, force-push,
  history rewrites).
- **NEVER hardcode off-design-system values** (raw hex/px that duplicate a theme token) — extend
  the theme's design system instead.
- **NEVER commit or expose credentials** (`secrets.stencil.json`, `.stencil`, `.env`) or let
  Claude read/write them. `stencil init` is yours to run.
- **NEVER install a base-theme or marketplace vendor *update* over a customized theme** — that's a
  scoped re-implementation project, not a merge (Claude will stop and warn you).
- **NEVER add a new `!important`** beyond the grandfathered baseline, and never strip a
  load-bearing one just to lower the count.

---

## 14. Do these (the positive habits)

- Give clear, single-intent tasks; share design references for parity work.
- Read the DoD report and run the human-only checks before pushing for review.
- Review your pair's PRs as carefully as you'd want yours reviewed — against the standards.
- Keep the baseline tag, and let Claude drive the `!important` count *down* over time.
- Raise anything that doesn't fit in `#suggestion-hub` — improve the standard for everyone.

---

## 15. Updating the process

Improvements land in the **kit repo** (never in a project — see §13). To pull them into a project:
`git pull` your local clone of the kit, then re-copy **only the generic files that changed** (most
of `rules/`, `docs/tooling.md`, `scripts/`). **Do not** blindly re-copy everything — you'd clobber
per-project fill-ins (`CLAUDE.md` identity, `important-baseline.md` counts).

---

## 16. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `stylelint-changed: baseline ref 'base-theme-v…' not found` | The baseline tag doesn't exist yet — tag it (Day 0), or set `STYLELINT_BASE=<ref>` for a one-off. |
| `check:important FAILED — found N, baseline is M` | A new `!important` was introduced. Remove it (see `css.md`); only the grandfathered baseline is allowed. |
| Lint floods with indentation noise on stock files | Expected — the scripts lint only *new* files vs the baseline; your editor's extension flags in-place edits live. |
| Claude reports "done" but only listed lint | Ask it to walk the full Definition of Done and report every category. |
| Claude tried to `stencil init` / read a secret | It shouldn't — that's a hard rule. Decline and run credentials yourself. |
| Can't clone the kit repo | It's private — clone over your authenticated GitHub access (SSH or `gh`); see the README. |

---

*Questions, or a rule that doesn't fit your project? Do not fix it locally — raise it in Discord
`#suggestion-hub` and open a PR on the kit repo. The process is a living standard, improved in one
place and copied everywhere.*
