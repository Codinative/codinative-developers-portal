# Changelog

All notable changes to the Codinative Developers Portal are documented in this file.

## 2026-07-01

### Added

- **BigCommerce Developer Onboarding** — a self-serve onboarding curriculum at
  `/docs/bigcommerce-mastery` that ramps new developers without a senior guiding them live.
  - **Guided Coursework** — an interactive, strictly sequential tracker over BigCommerce's
    official Learn courses, curated into four phases (Foundations → Stencil → APIs → B2B).
    Progress is saved in the browser, a course only unlocks once the previous one is complete,
    and locked courses/links are disabled. Includes a Prerequisites section.
  - **Beyond the Courses** modules — Customization Surfaces, Apps & Integrations (incl. the
    App Marketplace), Catalyst & Headless, Using the BigCommerce Docs, and Git & GitHub.
    Each explains the concept, illustrates it, and links to the authoritative BigCommerce docs.
- **Docs left sidebar index** (`DocsSidebar`) on every `/docs` page, grouped like the docs and
  highlighting the current page.
- **Previous / next pager** (`DocPager`) at the bottom of each doc page, driven by a shared
  navigation order (`docs-nav.ts`) so the sidebar and pager never drift.
- **Custom illustration components** (`diagram.tsx`) — responsive, dark-mode-aware `Flow`,
  `FileTree`, `Spectrum`, `Matrix`, `DecisionTree`, and `Timeline` primitives.

### Changed

- Docs now use a three-column layout (left index · content · on-this-page TOC) with symmetric
  gutters and full responsiveness.
- Promoted the shared `DocLink` helper into the doc component library; added the Onboarding
  card to the docs index.
- Renamed the project from `codinative-dashboard` to `codinative-developers-portal`.
