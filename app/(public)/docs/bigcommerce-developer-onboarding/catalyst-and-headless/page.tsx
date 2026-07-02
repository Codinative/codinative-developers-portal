import type { Metadata } from "next";
import {
  DocLayout,
  Section,
  C,
  Callout,
  DocLink,
  type TocItem,
} from "@/components/public/doc";

export const metadata: Metadata = {
  title: "Catalyst & Headless - BigCommerce Onboarding - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "catalyst", title: "Catalyst" },
  { id: "headless", title: "Fully headless" },
  { id: "multi-storefront", title: "Multi-storefront" },
  { id: "wordpress", title: "WordPress" },
  { id: "choosing", title: "When to use which" },
  { id: "references", title: "Read the docs" },
];

export default function CatalystAndHeadless() {
  return (
    <DocLayout
      title="Catalyst & Headless"
      intro="The modern, React-based way to build BigCommerce storefronts. This is an orientation module - know what each approach is and when it's the right call; the BigCommerce docs carry the deep implementation detail."
      toc={TOC}
    >
      <Section id="catalyst" title="Catalyst">
        <p>
          <strong>Catalyst</strong> is BigCommerce&rsquo;s official reference{" "}
          <strong>composable storefront</strong> and the recommended starting point for new
          modern builds. It&rsquo;s a <strong>Next.js</strong> app (App Router) built on{" "}
          <strong>React Server Components</strong>, shipping with a provided React UI kit, a{" "}
          <strong>typed GraphQL Storefront API client</strong>, and CLI scaffolding. It is
          technically headless, but &ldquo;batteries-included&rdquo; - you get a working,
          performant storefront to customise rather than a blank page.
        </p>
        <p>
          <strong>Makeswift</strong> comes pre-integrated as the recommended{" "}
          <strong>visual page builder</strong>, so merchants get drag-and-drop editing on
          top of your React components - the Catalyst answer to Page Builder.
        </p>
      </Section>

      <Section id="headless" title="Fully headless">
        <p>
          &ldquo;Headless&rdquo; means you build the frontend on any stack and talk to
          BigCommerce purely through the <strong>Storefront APIs</strong> (GraphQL
          Storefront preferred; Storefront REST for carts/checkouts). Catalyst is the
          opinionated reference; rolling your own is the same idea without the scaffolding.
          Key concerns you own: data fetching, <strong>session syncing</strong> (keeping
          cart/customer state aligned between your frontend and BigCommerce), routing, and
          the channel the storefront maps to.
        </p>
        <Callout>
          The <C>GraphQL Storefront API</C> is the heart of a headless build - its details
          (read-only products, token types, the Blueprint limitation, s2s deprecation) are
          covered by the GraphQL Storefront API course in the{" "}
          <DocLink href="/docs/bigcommerce-developer-onboarding/guided-coursework">Guided Coursework</DocLink> and
          the official{" "}
          <DocLink href="https://docs.bigcommerce.com/developer/docs/storefront/guides/graphql-storefront-api/overview">
            GraphQL Storefront API guide
          </DocLink>
          .
        </Callout>
      </Section>

      <Section id="multi-storefront" title="Multi-storefront">
        <p>
          <strong>Multi-storefront (MSF)</strong> runs several storefronts -{" "}
          <strong>channels</strong> - from a single store and catalog, each with its own
          domain, theme or headless frontend, currency, and content. Whether you build with
          Stencil, Catalyst, or headless, design content and integrations to be{" "}
          <strong>channel-aware</strong> so the right data shows on the right storefront.
        </p>
      </Section>

      <Section id="wordpress" title="WordPress">
        <p>
          The <strong>BigCommerce for WordPress</strong> plugin embeds BigCommerce
          catalog and checkout into a WordPress site - a headless pattern where WordPress is
          the frontend. Niche for us, but worth knowing it exists for content-led / blog-first
          merchants.
        </p>
      </Section>

      <Section id="choosing" title="When to use which">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Traditional theme, hosted, merchant-editable</strong> &rarr; Stencil.
          </li>
          <li>
            <strong>Modern React build, want a head start + visual editing</strong> &rarr;
            Catalyst.
          </li>
          <li>
            <strong>Existing custom frontend, an unusual framework, or maximum control</strong>{" "}
            &rarr; fully headless. (Multi-storefront works with Stencil and Catalyst too, so
            &ldquo;many channels&rdquo; on its own isn&rsquo;t a reason to go headless.)
          </li>
          <li>
            <strong>WordPress-centric content site</strong> &rarr; the WordPress plugin.
          </li>
        </ul>
      </Section>

      <Section id="references" title="Read the BigCommerce docs">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <DocLink href="https://docs.bigcommerce.com/developer/docs/storefront/catalyst/overview">
              Catalyst overview
            </DocLink>{" "}
            and{" "}
            <DocLink href="https://www.catalyst.dev/">the Catalyst project site</DocLink>.
          </li>
          <li>
            <DocLink href="https://docs.bigcommerce.com/developer/docs/storefront/headless/overview">
              Headless overview
            </DocLink>{" "}
            and the{" "}
            <DocLink href="https://docs.bigcommerce.com/developer/docs/storefront/headless/end-to-end-guides/graphql-storefront">
              GraphQL Storefront end-to-end guide
            </DocLink>
            .
          </li>
          <li>
            <DocLink href="https://docs.bigcommerce.com/developer/docs/admin/multi-storefront/overview">
              Multi-storefront overview
            </DocLink>{" "}
            and the{" "}
            <DocLink href="https://docs.bigcommerce.com/developer/docs/storefront/wordpress/overview">
              WordPress plugin
            </DocLink>
            .
          </li>
        </ul>
      </Section>
    </DocLayout>
  );
}
