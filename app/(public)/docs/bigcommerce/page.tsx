import type { Metadata } from "next";
import {
  DocLayout,
  Section,
  Code,
  C,
  Callout,
  Steps,
  DocLink,
  type TocItem,
} from "@/components/public/doc";

export const metadata: Metadata = {
  title: "BigCommerce guidelines - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "auth", title: "How auth works" },
  { id: "create-account", title: "Create an API account" },
  { id: "use-token", title: "Use the token" },
  { id: "v2-v3", title: "v2 vs v3" },
  { id: "app-oauth", title: "App OAuth tokens" },
  { id: "stencil", title: "Stencil CLI token" },
  { id: "storage", title: "Storing tokens" },
  { id: "references", title: "References" },
];

export default function BigCommerceDocs() {
  return (
    <DocLayout
      title="BigCommerce guidelines"
      intro="How to create API access for a BigCommerce store, the difference between v2 and v3, and the token you need for Stencil theme development."
      toc={TOC}
    >
      <Section id="auth" title="How authentication works">
        <p>
          Almost everything you build against a single store - the REST API (v2 and v3) and the
          GraphQL API - uses one thing: a <strong>store-level API account access token</strong>, sent
          on every request as the <C>X-Auth-Token</C> header.
        </p>
        <p>The base URL for a store is always:</p>
        <Code>{`https://api.bigcommerce.com/stores/{store_hash}/...`}</Code>
        <p>
          The <C>{`{store_hash}`}</C> identifies the store (you can see it in the control-panel URL,
          e.g. <C>store-abc123</C> means the hash is <C>abc123</C>).
        </p>
      </Section>

      <Section id="create-account" title="1. Create a store-level API account">
        <Steps>
          <li>
            In the store control panel go to <strong>Settings → API → Store-level API accounts</strong>.
          </li>
          <li>
            Click <strong>Create API account</strong>, give it a clear name (e.g.{" "}
            <C>codinative-signup-app</C>).
          </li>
          <li>
            Choose the <strong>OAuth scopes</strong> the integration needs - set each resource to
            none / read-only / modify. Grant the minimum required.
          </li>
          <li>
            Click <strong>Save</strong>. A credentials file downloads containing the{" "}
            <C>Client ID</C>, <C>Client Secret</C>, <C>Access Token</C>, and <C>API Path</C>.
          </li>
        </Steps>
        <Callout tone="warn">
          The access token is shown <strong>once</strong>. Store it in the dashboard secrets vault or
          your password manager - never commit it to a repo or paste it in chat. If it leaks, delete
          the API account and create a new one.
        </Callout>
      </Section>

      <Section id="use-token" title="2. Use the token">
        <p>Send the access token as the X-Auth-Token header on every request:</p>
        <Code>{`curl https://api.bigcommerce.com/stores/{store_hash}/v3/catalog/products \\
  -H "X-Auth-Token: {access_token}" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json"`}</Code>
      </Section>

      <Section id="v2-v3" title="3. v2 vs v3 - versions, not separate tokens">
        <p>
          A common point of confusion: <strong>v2 and v3 are API versions, not two different kinds of
          token</strong>. The same store API account token works for both - the scopes you granted
          decide what it can do, regardless of version.
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>v3</strong> - the modern API. Use it whenever a resource exists there (catalog /
            products, customers, etc.). Clean JSON, consistent pagination via{" "}
            <C>meta.pagination</C>.
          </li>
          <li>
            <strong>v2</strong> - the legacy API. Still required for a few resources that were never
            moved to v3 (orders are the classic example).
          </li>
        </ul>
        <p>
          Rule of thumb: prefer v3, and fall back to v2 only for resources that are not available in
          v3.
        </p>
      </Section>

      <Section id="app-oauth" title="App OAuth tokens (for published apps)">
        <p>
          Store API accounts are for back-office scripts and single-store integrations. Our{" "}
          <strong>embedded apps</strong> (signup forms, shipping rules, sticky add-to-cart) instead
          use <strong>app-level OAuth tokens</strong>: when a merchant installs the app, BigCommerce
          sends an auth code that the app exchanges for a per-store access token. Same{" "}
          <C>X-Auth-Token</C> header afterwards, but the token is obtained through the OAuth install
          flow rather than created by hand.
        </p>
      </Section>

      <Section id="stencil" title="Stencil CLI token (theme development)">
        <p>
          Stencil is BigCommerce&rsquo;s toolkit for developing Stencil storefront themes locally. It
          authenticates with a store API account access token - the &ldquo;Stencil token&rdquo;.
        </p>
        <Steps>
          <li>
            Create a store-level API account (step 1 above) with read access to{" "}
            <strong>Information &amp; Settings</strong>, <strong>Content</strong>, and{" "}
            <strong>Themes</strong> (check the current Stencil docs for the exact scope list). Copy
            its access token.
          </li>
          <li>
            Install the CLI:
            <Code>{`npm install -g @bigcommerce/stencil-cli`}</Code>
          </li>
          <li>
            Initialise the theme folder - it prompts for the store URL and the token:
            <Code>{`stencil init`}</Code>
            This writes a <C>.stencil</C> file (which holds the token, so it is git-ignored - never
            commit it).
          </li>
          <li>
            Preview locally, then bundle and push:
            <Code>{`stencil start      # local preview
stencil push       # bundle + upload the theme`}</Code>
          </li>
        </Steps>
      </Section>

      <Section id="storage" title="Where to keep tokens">
        <p>
          Put store tokens and secrets in the dashboard <strong>secrets vault</strong> (team sign-in
          required) rather than in <C>.env</C> files committed to a repo. Treat every access token
          like a password.
        </p>
      </Section>

      <Section id="references" title="Official references">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <DocLink href="https://developer.bigcommerce.com/docs/start/authentication/api-accounts">
              API accounts &amp; authentication
            </DocLink>
          </li>
          <li>
            <DocLink href="https://developer.bigcommerce.com/docs/rest-management">
              REST Management API (v3)
            </DocLink>
          </li>
          <li>
            <DocLink href="https://developer.bigcommerce.com/stencil-docs/getting-started/installing-stencil">
              Installing Stencil CLI
            </DocLink>
          </li>
        </ul>
      </Section>
    </DocLayout>
  );
}
