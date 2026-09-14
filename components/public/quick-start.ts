// Single source of truth for the Quick Start tracks - used by the hub cards,
// the day tabs, and the docs sidebar so titles and order never drift apart.

export const QUICK_START_HREF = "/docs/quick-start";
export const STENCIL_TRACK_HREF = "/docs/quick-start/stencil-theme";
export const ADMIN_GUIDE_HREF = "/docs/bigcommerce-admin-panel";

export type QuickStartDay = {
  day: number;
  slug: string;
  title: string;
  short: string;
  summary: string;
  href: string;
};

const day = (d: Omit<QuickStartDay, "href">): QuickStartDay => ({
  ...d,
  href: `${STENCIL_TRACK_HREF}/${d.slug}`,
});

export const STENCIL_DAYS: QuickStartDay[] = [
  day({
    day: 1,
    slug: "day-1-theme-setup",
    title: "Stencil theme setup",
    short: "Theme setup",
    summary:
      "Node via nvm, Cornerstone, the Stencil CLI token, stencil init, config.json and Page Builder, Handlebars, a custom page with its own URL, and bundling/pushing a theme.",
  }),
  day({
    day: 2,
    slug: "day-2-javascript-and-react",
    title: "JavaScript & React in Stencil",
    short: "JavaScript & React",
    summary:
      "Where theme JavaScript lives, PageManager and jsContext, rendering text with plain JS, then wiring React into Cornerstone's webpack build and mounting a component.",
  }),
  day({
    day: 3,
    slug: "day-3-graphql",
    title: "BigCommerce GraphQL Storefront API",
    short: "GraphQL",
    summary:
      "GraphQL fundamentals, the Storefront API Playground, calling /graphql from a theme, and rendering 3 products with 3 variants, images, prices and options in React.",
  }),
  day({
    day: 4,
    slug: "day-4-rest-api",
    title: "BigCommerce REST APIs",
    short: "REST API",
    summary:
      "REST fundamentals, Storefront vs Management APIs, which calls are safe in the browser (and which must never be), and adding products to the cart from React.",
  }),
  day({
    day: 5,
    slug: "day-5-build-your-set",
    title: "Capstone: Build Your Set page",
    short: "Build Your Set",
    summary:
      "Put it all together: a merchant-configurable page where a shopper picks options for 3 products and adds the whole set to the cart in one click.",
  }),
];

export const STENCIL_PROGRESS_KEY = "cn-quickstart-stencil-progress-v1";
