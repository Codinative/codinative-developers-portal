// Single source of truth for docs navigation - used by both the left sidebar
// index and the prev/next pager so their order never drifts apart.

export type NavItem = { label: string; href: string };
export type NavGroup = { title: string; items: NavItem[] };

export const DOCS_NAV: NavGroup[] = [
  {
    title: "Get started",
    items: [
      { label: "All docs", href: "/docs" },
      { label: "Environment setup", href: "/docs/environment-setup" },
    ],
  },
  {
    title: "Developer Onboarding",
    items: [
      { label: "Overview", href: "/docs/bigcommerce-developer-onboarding" },
      { label: "Guided Coursework", href: "/docs/bigcommerce-developer-onboarding/guided-coursework" },
      { label: "Customization Surfaces", href: "/docs/bigcommerce-developer-onboarding/customization-surfaces" },
      { label: "Apps & Integrations", href: "/docs/bigcommerce-developer-onboarding/apps-and-integrations" },
      { label: "Catalyst & Headless", href: "/docs/bigcommerce-developer-onboarding/catalyst-and-headless" },
      { label: "Using the BigCommerce Docs", href: "/docs/bigcommerce-developer-onboarding/using-the-bigcommerce-docs" },
      { label: "Git & GitHub", href: "/docs/bigcommerce-developer-onboarding/git-and-github" },
    ],
  },
  {
    title: "Platform guidelines",
    items: [
      { label: "BigCommerce guidelines", href: "/docs/bigcommerce-guidelines" },
      { label: "Shopify guidelines", href: "/docs/shopify-guidelines" },
      { label: "Web accessibility", href: "/docs/accessibility" },
    ],
  },
];

// Flattened reading order for the prev/next pager.
export const DOCS_ORDER: NavItem[] = DOCS_NAV.flatMap((group) => group.items);
