import type { Metadata } from "next";
import {
  DocLayout,
  Section,
  Code,
  C,
  Callout,
  DocLink,
  type TocItem,
} from "@/components/public/doc";

export const metadata: Metadata = {
  title: "Using the BigCommerce Docs - BigCommerce Onboarding - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "navigating", title: "Navigating the docs" },
  { id: "ai-tools", title: "The AI tools menu" },
  { id: "markdown", title: "Markdown & llms.txt" },
  { id: "mcp", title: "The docs MCP server" },
  { id: "responsibly", title: "Using AI responsibly" },
  { id: "references", title: "Read the docs" },
];

export default function UsingTheDocs() {
  return (
    <DocLayout
      title="Using the BigCommerce Docs"
      intro="Your most-used tool as a BigCommerce developer is the documentation itself. The modern BigCommerce docs are built for both humans and AI assistants - learn to navigate them fast and to wire them into your editor and Claude Code."
      toc={TOC}
    >
      <Section id="navigating" title="Navigating the docs">
        <p>
          The{" "}
          <DocLink href="https://docs.bigcommerce.com/developer">
            BigCommerce developer documentation
          </DocLink>{" "}
          has five top tabs:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Docs</strong> - conceptual guides, grouped Storefront / Admin /
            Integrations / B2B. This is what our curriculum maps to.
          </li>
          <li>
            <strong>API Reference</strong> - every REST &amp; GraphQL endpoint, with the
            in-browser <strong>Request Runner</strong>.
          </li>
          <li>
            <strong>Learn</strong> - structured learning plans and courses (we route you
            through these in the{" "}
            <DocLink href="/docs/bigcommerce-developer-onboarding/guided-coursework">Guided Coursework</DocLink>{" "}
            module).
          </li>
          <li>
            <strong>Community</strong> - the BigCommerce{" "}
            <DocLink href="https://docs.bigcommerce.com/developer/community/connect">
              developer community and forums
            </DocLink>{" "}
            for questions and discussion.
          </li>
          <li>
            <strong>Changelog</strong> - platform and API changes. Check it when something
            behaves differently than the docs imply.
          </li>
        </ul>
        <p>
          Use the search box (press <C>/</C>) for direct lookups, and the <strong>Ask
          AI</strong> button for natural-language questions across the whole doc set.
        </p>
      </Section>

      <Section id="ai-tools" title="The AI tools menu (Copy page)">
        <p>
          Every docs page has a <strong>Copy page</strong> button with a dropdown of
          AI-oriented actions. These turn any doc page into something an AI assistant can
          use directly:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Copy page as Markdown</strong> - copies the page as clean Markdown,
            ready to paste into Claude, ChatGPT, or a prompt.
          </li>
          <li>
            <strong>Ask a question</strong> - opens the docs AI assistant scoped to the
            content.
          </li>
          <li>
            <strong>View as Markdown</strong> - shows the page as raw Markdown in the
            browser.
          </li>
          <li>
            <strong>Open in Claude</strong> / <strong>Open in ChatGPT</strong> - sends the
            page into a chat with that assistant so you can ask about it.
          </li>
          <li>
            <strong>Connect to Cursor</strong> / <strong>Connect to Claude Code</strong> -
            one-click install of the docs <strong>MCP server</strong> into your editor /
            CLI, so the assistant can query BigCommerce docs live.
          </li>
        </ul>
      </Section>

      <Section id="markdown" title="Markdown & llms.txt shortcuts">
        <p>
          Two mechanisms power the above, and you can use them directly:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Append <C>.md</C> to any docs URL</strong> to get clean Markdown of that
            page - handy for feeding a single page to an AI without copy-paste.
          </li>
          <li>
            <strong><C>llms.txt</C></strong> - a machine-readable index of the docs. The{" "}
            <DocLink href="https://docs.bigcommerce.com/developer/llms.txt">
              developer-scoped index
            </DocLink>{" "}
            lists every page, and appending <C>/llms.txt</C> to any section URL gives that
            section&rsquo;s index.
          </li>
        </ul>
      </Section>

      <Section id="mcp" title="The docs MCP server">
        <p>
          BigCommerce hosts an <strong>MCP server</strong> at{" "}
          <C>https://docs.bigcommerce.com/_mcp/server</C> that lets AI tools search and read
          the docs on demand. Wire it into Claude Code once and the assistant can pull
          authoritative BigCommerce docs while you work:
        </p>
        <Code>{`claude mcp add --transport http bigcommerce-docs https://docs.bigcommerce.com/_mcp/server
# add --scope user to make it available in every project`}</Code>
        <p>
          Cursor, Codex, and Claude Desktop have their own one-step setups - the{" "}
          <strong>AI Agent Setup</strong> page documents each. The &ldquo;Connect to&rdquo;
          options in the Copy-page menu do this for you.
        </p>
      </Section>

      <Section id="responsibly" title="Using AI responsibly">
        <Callout tone="warn">
          AI assistants accelerate learning but <strong>can be confidently wrong</strong>,
          especially on version-specific details (v2 vs v3, token deprecations, exact
          scopes). Treat AI output as a fast first draft, then{" "}
          <strong>verify against the actual doc page or the API Reference</strong> before
          shipping. Never paste store tokens, secrets, or customer data into an external AI
          tool.
        </Callout>
      </Section>

      <Section id="references" title="Read the BigCommerce docs">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <DocLink href="https://docs.bigcommerce.com/developer/docs/ai-agent-setup">
              AI Agent Setup
            </DocLink>{" "}
            - MCP server, llms.txt, and per-client connection instructions.
          </li>
          <li>
            <DocLink href="https://docs.bigcommerce.com/developer/api-reference">
              API Reference
            </DocLink>{" "}
            and{" "}
            <DocLink href="https://docs.bigcommerce.com/developer/llms.txt">
              the llms.txt index
            </DocLink>
            .
          </li>
        </ul>
      </Section>
    </DocLayout>
  );
}
