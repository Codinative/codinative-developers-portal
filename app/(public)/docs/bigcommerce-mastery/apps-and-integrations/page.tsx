import type { Metadata } from "next";
import {
  DocLayout,
  Section,
  C,
  Callout,
  DocLink,
  type TocItem,
} from "@/components/public/doc";
import { Diagram, Flow, FlowStep } from "@/components/public/diagram";

export const metadata: Metadata = {
  title: "Apps & Integrations - BigCommerce Onboarding - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "marketplace", title: "The App Marketplace" },
  { id: "types", title: "Types of apps" },
  { id: "oauth", title: "The OAuth install flow" },
  { id: "extensions", title: "App extensions" },
  { id: "starter", title: "The Next.js starter app" },
  { id: "channels", title: "Channels & multi-storefront" },
  { id: "bigdesign", title: "BigDesign" },
  { id: "publishing", title: "Managing & publishing" },
  { id: "references", title: "Read the docs" },
];

export default function AppsAndIntegrations() {
  return (
    <DocLayout
      title="Apps & Integrations"
      intro="Beyond themes, BigCommerce is extended with apps - both the thousands of third-party apps in the App Marketplace and the custom ones we build. This module maps the marketplace, the app landscape, the install flow, and how to build and ship your own."
      toc={TOC}
    >
      <Section id="marketplace" title="The App Marketplace">
        <p>
          The <strong>BigCommerce App Marketplace</strong> is where merchants discover and
          install apps that extend their store. It&rsquo;s built into the control panel
          (<em>Apps &rarr; Marketplace</em>) and also browsable publicly. It lists{" "}
          <strong>thousands of third-party apps</strong> - built by BigCommerce technology
          partners and reviewed before listing - across categories like shipping &amp;
          fulfilment, marketing &amp; conversion, reviews &amp; UGC, accounting / ERP / PIM,
          page builders, analytics, and customer support.
        </p>
        <p>
          Most install with a single click through the OAuth flow below, and can be free or
          paid (billed through BigCommerce&rsquo;s Unified Billing). For us it cuts two ways:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>As implementers</strong> - for client stores we often evaluate, install,
            and configure an existing third-party app instead of building from scratch.
            Always check the marketplace first; a solid app may already solve the problem.
          </li>
          <li>
            <strong>As builders</strong> - when nothing fits, we build a custom app and
            (optionally) publish it to the marketplace ourselves.
          </li>
        </ul>
        <Callout>
          Only <strong>approved</strong> apps appear in the marketplace - BigCommerce
          reviews each one for security, functionality, and listing quality before it goes
          live.
        </Callout>
        <p>
          <strong>Browse it:</strong>{" "}
          <DocLink href="https://www.bigcommerce.com/apps/">BigCommerce App Marketplace</DocLink>.
        </p>
      </Section>

      <Section id="types" title="Types of apps">
        <p>
          An &ldquo;app&rdquo; is any external software that authenticates to one or more
          stores and uses the APIs. The main distinctions:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Single-click apps</strong> - listed in the BigCommerce marketplace and
            installed by merchants with one click. They use the <strong>OAuth flow</strong>{" "}
            to receive a per-store token.
          </li>
          <li>
            <strong>Custom integrations</strong> - private software for a specific store
            (e.g. an ERP sync) using a store-level API account token. No marketplace
            listing.
          </li>
          <li>
            <strong>Channel apps</strong> - apps that create and manage sales channels /
            storefronts. (See channels below.)
          </li>
        </ul>
      </Section>

      <Section id="oauth" title="The OAuth install flow">
        <p>
          When a merchant installs a single-click app, BigCommerce runs the{" "}
          <strong>OAuth authorization-code flow</strong> to give your app a unique access
          token for that store:
        </p>

        <Diagram caption="Merchant install -> per-store access token">
          <Flow>
            <FlowStep title="Merchant clicks Install" desc="from the marketplace" />
            <FlowStep title="GET /auth" desc="BigCommerce sends a temporary code + scope + context" tone="accent" />
            <FlowStep title="Exchange code" desc="your server swaps it for an access token" />
            <FlowStep title="Store the token" desc="keyed by store hash; use on every call" />
          </Flow>
        </Diagram>

        <p>
          Your app implements three callbacks: <C>/auth</C> (install - exchange the code),{" "}
          <C>/load</C> (open the app inside the control panel via a signed payload), and{" "}
          <C>/uninstall</C>. After install, requests use the same <C>X-Auth-Token</C>{" "}
          header as everything else - the difference is only how the token was obtained.
        </p>
        <Callout tone="warn">
          App OAuth tokens are <strong>per installing store</strong> and must be stored
          securely server-side (the secrets vault / your backend), never exposed to the
          browser.
        </Callout>
      </Section>

      <Section id="extensions" title="App extensions">
        <p>
          <strong>App extensions</strong> let your app surface its own actions inside the
          BigCommerce control panel UI - for example a custom action on the product list -
          so merchants use your functionality without leaving their admin. They require an
          app-level OAuth app.
        </p>
      </Section>

      <Section id="starter" title="The Next.js starter app">
        <p>
          The fastest way to learn app development is BigCommerce&rsquo;s{" "}
          <strong>Next.js Starter App</strong> tutorial - it walks you through scaffolding,
          the OAuth callbacks, connecting to a store, and rendering a control-panel UI. Work
          through it end-to-end on a sandbox before building anything bespoke.
        </p>
      </Section>

      <Section id="channels" title="Channels & multi-storefront">
        <p>
          A store can run multiple <strong>channels</strong> - additional storefronts,
          marketplaces, or POS surfaces - all from one catalog (this is{" "}
          <strong>multi-storefront</strong>). <strong>Channel apps</strong> create and
          manage these surfaces. When you build apps and integrations, design them to be{" "}
          <strong>multi-storefront aware</strong> (scope data to the right channel) rather
          than assuming a single storefront.
        </p>
      </Section>

      <Section id="bigdesign" title="BigDesign">
        <p>
          <strong>BigDesign</strong> is BigCommerce&rsquo;s React component library. Build
          your app&rsquo;s control-panel UI with it so the app looks and behaves native to
          the BigCommerce admin - consistent components, spacing, and accessibility out of
          the box.
        </p>
      </Section>

      <Section id="publishing" title="Managing & publishing apps">
        <p>
          Apps are created and configured in the <strong>Developer Portal</strong> (where
          you set callback URLs, scopes, and listing details). Marketplace apps then go
          through an <strong>approval process</strong> before they&rsquo;re published, and{" "}
          <strong>Unified Billing</strong> lets apps charge through BigCommerce. For
          internal one-store tools you can skip the marketplace entirely and use a
          store-level API account.
        </p>
      </Section>

      <Section id="references" title="Read the BigCommerce docs">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <DocLink href="https://www.bigcommerce.com/apps/">
              BigCommerce App Marketplace
            </DocLink>{" "}
            - browse the third-party apps merchants can install.
          </li>
          <li>
            <DocLink href="https://docs.bigcommerce.com/developer/docs/integrations/apps/introduction">
              Apps: introduction
            </DocLink>{" "}
            and{" "}
            <DocLink href="https://docs.bigcommerce.com/developer/docs/integrations/apps/guide/types-of-apps">
              types of apps
            </DocLink>
            .
          </li>
          <li>
            <DocLink href="https://docs.bigcommerce.com/developer/docs/integrations/apps/guide/auth">
              The single-click app OAuth flow
            </DocLink>{" "}
            and{" "}
            <DocLink href="https://docs.bigcommerce.com/developer/docs/integrations/apps/app-extensions/overview">
              app extensions
            </DocLink>
            .
          </li>
          <li>
            <DocLink href="https://docs.bigcommerce.com/developer/docs/integrations/apps/tutorial-next.js-starter-app/introduction">
              Build a sample app (Next.js starter)
            </DocLink>
            .
          </li>
          <li>
            <DocLink href="https://docs.bigcommerce.com/developer/docs/integrations/channels/introduction">
              Channels
            </DocLink>{" "}
            and{" "}
            <DocLink href="https://github.com/bigcommerce/big-design">
              BigDesign (GitHub)
            </DocLink>
            .
          </li>
        </ul>
      </Section>
    </DocLayout>
  );
}
