# Changelog

All notable changes to the Codinative Developers Portal are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this
project adheres to [Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-07-02

### Added

- **BigCommerce Developer Onboarding** — a self-serve onboarding curriculum at
  `/docs/bigcommerce-developer-onboarding` that ramps new developers without a senior guiding them live.
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
- **Web accessibility & compliance guide** (`/docs/accessibility`) — a plain-language guide
  to WCAG, the ADA and accessibility demand letters, the overlay-widget myth, and how a site
  is actually brought into compliance. Added to the docs sidebar under Platform guidelines.

### Changed

- Docs now use a three-column layout (left index · content · on-this-page TOC) with symmetric
  gutters and full responsiveness.
- Promoted the shared `DocLink` helper into the doc component library; added the Onboarding
  card to the docs index.
- Renamed the project from `codinative-dashboard` to `codinative-developers-portal`.

### Security

- Restricted the internal projects listing (`/what-we-built`) to signed-in team members — it was
  previously public. Removed it from the middleware public allowlist, added a server-side
  `auth()` guard, and moved the page into the authenticated dashboard (reachable via a
  "What we built" sidebar link). Removed every public entry point (header nav, footer, and
  the landing-page CTA + card) and scoped the landing "no login needed" copy to the docs.

## [1.0.0] - 2026-06-24

### Added

- Public **Developers Portal** — landing page, documentation, and projects.
- **Docs** — "on this page" navigation, an Environment setup guide, and BigCommerce & Shopify
  platform guidelines.
- **Projects listing** — live app website links for each project.
