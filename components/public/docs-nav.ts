// Single source of truth for docs navigation - used by both the left sidebar
// index and the prev/next pager so their order never drifts apart.

export type NavItem = { label: string; href: string };
export type NavGroup = { title: string; items: NavItem[] };

export const DOCS_NAV: NavGroup[] = [
  {
    title: "Get started",
    items: [
      { label: "All docs", href: "/docs" },
      { label: "Environment setup", href: "/docs/environment" },
    ],
  },
  {
    title: "Developer Onboarding",
    items: [
      { label: "Overview", href: "/docs/bigcommerce-mastery" },
      { label: "Guided Coursework", href: "/docs/bigcommerce-mastery/learning-path" },
      { label: "Customization Surfaces", href: "/docs/bigcommerce-mastery/customization-surfaces" },
      { label: "Apps & Integrations", href: "/docs/bigcommerce-mastery/apps-and-integrations" },
      { label: "Catalyst & Headless", href: "/docs/bigcommerce-mastery/catalyst-and-headless" },
      { label: "Using the BigCommerce Docs", href: "/docs/bigcommerce-mastery/using-the-docs" },
      { label: "Git & GitHub", href: "/docs/bigcommerce-mastery/git-and-github" },
    ],
  },
  {
    title: "Platform guidelines",
    items: [
      { label: "BigCommerce guidelines", href: "/docs/bigcommerce" },
      { label: "Shopify guidelines", href: "/docs/shopify" },
    ],
  },
];

// Flattened reading order for the prev/next pager.
export const DOCS_ORDER: NavItem[] = DOCS_NAV.flatMap((group) => group.items);
