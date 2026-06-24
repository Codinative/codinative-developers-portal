import type { Metadata } from "next";
import {
  DocLayout,
  Section,
  Code,
  C,
  Callout,
  Steps,
  type TocItem,
} from "@/components/public/doc";

export const metadata: Metadata = {
  title: "Shopify guidelines - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "prerequisites", title: "Prerequisites" },
  { id: "authenticate", title: "Authenticate" },
  { id: "pull", title: "Pull the theme" },
  { id: "preview", title: "Preview locally" },
  { id: "push", title: "Push the theme" },
  { id: "versioning", title: "Versioning" },
  { id: "reference", title: "Quick reference" },
];

export default function ShopifyDocs() {
  return (
    <DocLayout
      title="Shopify guidelines"
      intro="Set up the Shopify CLI and use the pull / preview / push workflow to develop themes safely. Examples use our Chaitonics store; swap in your store domain."
      toc={TOC}
    >
      <Section id="prerequisites" title="Prerequisites">
        <p>Install Node.js, then the Shopify CLI and theme plugin:</p>
        <Code>{`npm install -g @shopify/cli @shopify/theme`}</Code>
        <p>Verify it is installed:</p>
        <Code>{`shopify version`}</Code>
        <Callout>
          New to the team? Follow the{" "}
          <a
            href="/docs/environment"
            className="font-medium text-indigo-600 underline-offset-2 transition hover:underline dark:text-indigo-300"
          >
            environment setup
          </a>{" "}
          guide first to get Node installed with NVM.
        </Callout>
      </Section>

      <Section id="authenticate" title="Authenticate">
        <p>
          Authentication happens automatically the first time you run a theme command - it opens a
          browser window to log in with your Shopify account. No manual token setup is needed for
          personal access.
        </p>
        <p>
          <strong>For agency / developer access</strong> without sharing the main account: in{" "}
          <strong>Shopify Admin → Online Store → Themes → Theme Access</strong>, generate a password,
          then append it to commands:
        </p>
        <Code>{`--password shptka_xxxxxxxxxxxx`}</Code>
        <Callout tone="warn">
          A Theme Access password (<C>shptka_...</C>) is a secret. Keep it in the secrets vault, never
          in a repo.
        </Callout>
      </Section>

      <Section id="pull" title="Pull the theme">
        <Code>{`# select a theme from a list
shopify theme pull --store <your-store>.myshopify.com

# or pull a specific theme by id
shopify theme pull --store <your-store>.myshopify.com --theme 148283785355

# or just one file (faster for small changes)
shopify theme pull --store <your-store>.myshopify.com --only assets/base.css`}</Code>
      </Section>

      <Section id="preview" title="Preview locally">
        <p>
          Always preview before pushing. This serves your local files while the live store stays
          untouched.
        </p>
        <Code>{`shopify theme dev --store <your-store>.myshopify.com
# opens http://127.0.0.1:9292  (Ctrl+C to stop)`}</Code>
        <p>Local edits reflect instantly in the browser; customers see no changes.</p>
      </Section>

      <Section id="push" title="Push the theme">
        <Steps>
          <li>
            <strong>As a new unpublished theme (recommended)</strong> - review before going live:
            <Code>{`shopify theme push --store <your-store>.myshopify.com --unpublished \\
  --theme "Chaitonics-v6.5.6-04-Apr-2026"`}</Code>
          </li>
          <li>
            <strong>Update an existing unpublished theme</strong> - same name, overwrites it:
            <Code>{`shopify theme push --store <your-store>.myshopify.com \\
  --theme "Chaitonics-v6.5.6-04-Apr-2026"`}</Code>
          </li>
          <li>
            <strong>Overwrite the live theme</strong> - goes live immediately, use with care:
            <Code>{`shopify theme push --store <your-store>.myshopify.com --live`}</Code>
          </li>
        </Steps>
        <Callout tone="warn">
          Always push as <C>--unpublished</C> first, review it in Shopify Admin, then publish. Never
          push <C>--live</C> unless you are 100% confident.
        </Callout>
      </Section>

      <Section id="versioning" title="Versioning convention">
        <p>Name theme versions so the team knows what changed and when:</p>
        <Code>{`Chaitonics-v{major}.{minor}.{patch}-{DD-Mon-YYYY}

Chaitonics-v6.5.5-09-Mar-2026   <- original pulled theme
Chaitonics-v6.5.6-04-Apr-2026   <- small fixes (bump patch)
Chaitonics-v6.6.0-15-Apr-2026   <- new section/feature (bump minor)`}</Code>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            Bump <strong>patch</strong> for small fixes, <strong>minor</strong> for new
            sections/features, <strong>major</strong> for redesigns.
          </li>
          <li>Always include the date.</li>
        </ul>
      </Section>

      <Section id="reference" title="Quick reference">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              <tr>
                <th className="px-4 py-2 font-medium">Task</th>
                <th className="px-4 py-2 font-medium">Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              <Row task="Install CLI" cmd="npm install -g @shopify/cli @shopify/theme" />
              <Row task="Check version" cmd="shopify version" />
              <Row task="Pull (pick from list)" cmd="shopify theme pull --store <store>.myshopify.com" />
              <Row task="Local preview" cmd="shopify theme dev --store <store>.myshopify.com" />
              <Row
                task="Push unpublished"
                cmd={`shopify theme push --store <store>.myshopify.com --unpublished --theme "Name"`}
              />
              <Row task="Push to live" cmd="shopify theme push --store <store>.myshopify.com --live" />
            </tbody>
          </table>
        </div>
        <p>
          Full, store-specific instructions live in the{" "}
          <DocLink href="https://github.com/Codinative/developer-setup-guides">
            developer-setup-guides
          </DocLink>{" "}
          repo, and the theme itself is{" "}
          <DocLink href="https://github.com/Codinative/chaitonics">Codinative/chaitonics</DocLink>.
        </p>
      </Section>
    </DocLayout>
  );
}

function Row({ task, cmd }: { task: string; cmd: string }) {
  return (
    <tr className="text-gray-600 dark:text-gray-300">
      <td className="px-4 py-2 align-top whitespace-nowrap">{task}</td>
      <td className="px-4 py-2">
        <code className="font-mono text-xs break-all text-gray-800 dark:text-gray-200">{cmd}</code>
      </td>
    </tr>
  );
}

function DocLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-indigo-600 underline-offset-2 transition hover:underline dark:text-indigo-300"
    >
      {children}
    </a>
  );
}
