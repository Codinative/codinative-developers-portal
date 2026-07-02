// ----------------------------------------------------------------------------
// Internal project catalogue for the team-only projects page (/what-we-built).
// Plain data so the page stays a Server Component. Add new projects here.
// ----------------------------------------------------------------------------

export type Project = {
  name: string;
  stack: string;
  description: string;
  repo?: string; // GitHub URL (Codinative org)
  website?: string; // live deployed site (Codinative subdomain)
  legacy?: boolean;
};

export type ProjectGroup = {
  category: string;
  blurb: string;
  projects: Project[];
};

const GH = "https://github.com/Codinative";

export const PROJECT_GROUPS: ProjectGroup[] = [
  {
    category: "bigC - BigCommerce AI Assistant",
    blurb:
      "A three-part AI system that lets a BigCommerce merchant manage their store by chatting in plain language.",
    projects: [
      {
        name: "BigCommerce-Manager-Ai",
        stack: "Next.js + TypeScript",
        description:
          "The merchant-facing chat UI and BigCommerce app shell (OAuth install, billing, jobs marketplace). Proxies every request to the backend.",
        repo: `${GH}/BigCommerce-Manager-Ai`,
      },
      {
        name: "bigC-management-backend",
        stack: "Python + FastAPI + LlamaIndex",
        description:
          "The agent brain: runs the LLM, calls BigCommerce tools over MCP, streams replies, and stores chats and jobs in Firestore.",
        repo: `${GH}/bigC-management-backend`,
      },
      {
        name: "bigC-mcp",
        stack: "TypeScript + MCP SDK",
        description:
          "An MCP server exposing 21 BigCommerce operations (products, customers, orders, analytics) as tools the agent can call.",
        repo: `${GH}/bigC-mcp`,
      },
      {
        name: "agent",
        stack: "Python + FastAPI",
        description:
          "The early prototype that became the agent backend. Kept for reference; superseded by bigC-management-backend.",
        repo: `${GH}/agent`,
        legacy: true,
      },
    ],
  },
  {
    category: "BigCommerce Apps",
    blurb: "Embedded apps that extend a merchant's BigCommerce store.",
    projects: [
      {
        name: "custom-signup-forms",
        stack: "Next.js + Firebase + Stripe",
        description:
          "A drag-and-drop signup form builder with approval workflows, per-group email templates, and Stripe-billed SaaS gating.",
        repo: `${GH}/custom-signup-forms`,
        website: "https://custom-signup-forms.codinative.com/",
      },
      {
        name: "Custom-Shipping-Rules-App",
        stack: "Next.js + TypeScript",
        description:
          "Registers a custom weight-based UPS shipping provider for UAE domestic delivery, returning live rates at checkout.",
        repo: `${GH}/Custom-Shipping-Rules-App`,
        website: "https://custom-shipping-rules.codinative.com/",
      },
      {
        name: "Sticky-Add-to-Cart-App",
        stack: "Next.js + TypeScript",
        description:
          "Adds a persistent, customizable Add to Cart bar to product pages, with smart triggers and variant/quantity handling.",
        repo: `${GH}/Sticky-Add-to-Cart-App`,
        website: "https://sticky-add-to-cart.codinative.com/",
      },
    ],
  },
  {
    category: "App Marketing Sites",
    blurb: "Public landing and documentation sites for each BigCommerce app.",
    projects: [
      {
        name: "Custom-Signup-Forms-Website",
        stack: "Next.js",
        description: "Marketing and documentation site for the Custom Signup Forms app.",
        repo: `${GH}/Custom-Signup-Forms-Website`,
        website: "https://custom-signup-forms.codinative.com/",
      },
      {
        name: "Sticky-Add-to-Cart-Website",
        stack: "Next.js",
        description: "Marketing and documentation site for the Sticky Add to Cart app.",
        repo: `${GH}/Sticky-Add-to-Cart-Website`,
        website: "https://sticky-add-to-cart.codinative.com/",
      },
      {
        name: "custom-shipping-rules-website",
        stack: "Next.js",
        description: "Marketing and documentation site for the Custom Shipping Rules app.",
        repo: `${GH}/custom-shipping-rules-website`,
        website: "https://custom-shipping-rules.codinative.com/",
      },
    ],
  },
  {
    category: "Automation & Tooling",
    blurb: "Scripts and services that automate store operations and migrations.",
    projects: [
      {
        name: "product-exporter",
        stack: "Python",
        description: "A CLI that exports a BigCommerce catalog to CSV, with optional date filtering.",
        repo: `${GH}/product-exporter`,
      },
      {
        name: "v2-to-v3",
        stack: "Python + Flask",
        description:
          "A BigCommerce v2 to v3 migration toolkit: CLI scripts to audit, back up, and clone products, plus a Flask dashboard to manage stores and run migration tests.",
        repo: `${GH}/v2-to-v3`,
      },
      {
        name: "ai-rewrites",
        stack: "Python + Claude API + LlamaIndex",
        description:
          "AI product SEO: generates high-quality product content and batch-processes modifiers, prices, and product settings.",
        repo: `${GH}/ai-rewrites`,
      },
      {
        name: "tellason-automation",
        stack: "Python",
        description:
          "Publishes Tellason's weekly Item of the Week to BigCommerce by scraping the Mailchimp campaign and updating the storefront widget.",
        repo: `${GH}/tellason-automation`,
      },
      {
        name: "chaitonics-email-campaigns",
        stack: "Python",
        description:
          "Generates branded, responsive, email-client-safe HTML campaigns for the Chai Tonics brand from structured content.",
        repo: `${GH}/chaitonics-email-campaigns`,
      },
    ],
  },
  {
    category: "Proxy Servers",
    blurb: "Lightweight server-to-server services that keep store credentials off the storefront.",
    projects: [
      {
        name: "TeckwrapUk-NodeJS-Server",
        stack: "Node.js + Express + TypeScript",
        description:
          "Adds or removes an order-level checkout fee for Teckwrap UK by calling the BigCommerce v3 API server-side.",
        repo: `${GH}/TeckwrapUk-NodeJS-Server`,
      },
    ],
  },
  {
    category: "Shopify",
    blurb: "Shopify storefront work.",
    projects: [
      {
        name: "chaitonics",
        stack: "Shopify Liquid (OS 2.0)",
        description:
          "The Chaitonics Shopify theme, with internal development and deployment documentation for the chaitonics.com store.",
        repo: `${GH}/chaitonics`,
      },
    ],
  },
  {
    category: "Internal Platforms & Docs",
    blurb: "Tooling the Codinative team uses to build and ship everything else.",
    projects: [
      {
        name: "codinative-developers-portal",
        stack: "Next.js + NextAuth + Firebase",
        description:
          "This portal, plus the gated team workspace: a projects hub, QA checklists, and an AES-encrypted secrets vault.",
        repo: `${GH}/codinative-developers-portal`,
      },
      {
        name: "developer-setup-guides",
        stack: "Markdown",
        description: "Onboarding guides for the dev team (NVM on Windows, the Shopify theme workflow).",
        repo: `${GH}/developer-setup-guides`,
      },
    ],
  },
];
