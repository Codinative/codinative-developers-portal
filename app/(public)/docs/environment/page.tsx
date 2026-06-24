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
  title: "Environment setup - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "why", title: "Why NVM" },
  { id: "before", title: "Before you install" },
  { id: "install", title: "Install (Windows)" },
  { id: "verify", title: "Verify the install" },
  { id: "node", title: "Install & switch Node" },
  { id: "macos", title: "macOS / Linux" },
  { id: "cheatsheet", title: "Cheatsheet" },
  { id: "links", title: "Useful links" },
];

export default function EnvironmentDocs() {
  return (
    <DocLayout
      title="Environment setup"
      intro="Install Node.js with a version manager so you can switch versions per project. Node is required for everything else - the apps, the websites, and the Shopify CLI."
      toc={TOC}
    >
      <Section id="why" title="Why NVM">
        <p>
          NVM (Node Version Manager) lets you install multiple Node.js versions on one machine and
          switch between them per project. Use <strong>nvm-windows</strong> on Windows; on macOS and
          Linux use the original <strong>nvm</strong> (see below).
        </p>
        <Callout>
          The original <C>nvm</C> does not support Windows - Windows users need{" "}
          <C>nvm-windows</C>, which works the same way.
        </Callout>
      </Section>

      <Section id="before" title="Before you install (Windows)">
        <Steps>
          <li>
            Uninstall any existing Node.js from <strong>Settings → Apps → Node.js</strong>.
          </li>
          <li>
            Delete leftover folders if they exist:
            <Code>{`C:\\Program Files\\nodejs
C:\\Users\\<YourName>\\AppData\\Roaming\\npm`}</Code>
          </li>
        </Steps>
      </Section>

      <Section id="install" title="Install nvm-windows">
        <Steps>
          <li>
            Download <C>nvm-setup.exe</C> from the latest release:
            <Code>{`https://github.com/coreybutler/nvm-windows/releases`}</Code>
          </li>
          <li>Run the installer and follow the prompts - the default paths are fine.</li>
          <li>It adds nvm to your PATH automatically.</li>
        </Steps>
      </Section>

      <Section id="verify" title="Verify the install">
        <p>Open a new Command Prompt or PowerShell window and run:</p>
        <Code>{`nvm version`}</Code>
        <p>
          You should see a version like <C>1.2.2</C>. If you get &ldquo;command not
          recognized&rdquo;, restart your PC and try again.
        </p>
      </Section>

      <Section id="node" title="Install & switch Node versions">
        <Code>{`nvm install lts      # latest LTS (recommended)
nvm install 20       # a specific version
nvm use 20           # switch to it
nvm current          # show active version
nvm list             # list installed versions`}</Code>
        <Callout tone="warn">
          On Windows, run the terminal as <strong>Administrator</strong> when using{" "}
          <C>nvm use</C> - nvm updates a symlink under <C>C:\Program Files\</C> and will otherwise
          fail with &ldquo;Access Denied&rdquo;.
        </Callout>
        <p>Confirm Node and npm work:</p>
        <Code>{`node -v
npm -v`}</Code>
      </Section>

      <Section id="macos" title="macOS / Linux">
        <p>
          On macOS and Linux, install the original nvm, then use the same{" "}
          <C>install</C> / <C>use</C> commands:
        </p>
        <Code>{`# install nvm (see the repo for the latest install line)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# restart the terminal, then:
nvm install --lts
nvm use --lts
node -v && npm -v`}</Code>
        <Callout tone="warn">
          Before running any install script from the internet, open the URL and read it first. Only
          run scripts from the official source (here, the{" "}
          <DocLink href="https://github.com/nvm-sh/nvm">nvm-sh/nvm</DocLink> repo).
        </Callout>
      </Section>

      <Section id="cheatsheet" title="Command cheatsheet">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              <tr>
                <th className="px-4 py-2 font-medium">Command</th>
                <th className="px-4 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              <Row cmd="nvm install lts" desc="Install latest LTS Node.js" />
              <Row cmd="nvm install 20" desc="Install Node.js v20" />
              <Row cmd="nvm use 20" desc="Switch to Node.js v20" />
              <Row cmd="nvm list" desc="List installed versions" />
              <Row cmd="nvm current" desc="Show active version" />
              <Row cmd="nvm uninstall 18" desc="Remove Node.js v18" />
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="links" title="Useful links">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <DocLink href="https://github.com/coreybutler/nvm-windows/releases">
              nvm-windows releases
            </DocLink>
          </li>
          <li>
            <DocLink href="https://github.com/nvm-sh/nvm">nvm (macOS / Linux)</DocLink>
          </li>
          <li>
            <DocLink href="https://nodejs.org">Node.js official site</DocLink>
          </li>
        </ul>
      </Section>
    </DocLayout>
  );
}

function Row({ cmd, desc }: { cmd: string; desc: string }) {
  return (
    <tr className="text-gray-600 dark:text-gray-300">
      <td className="px-4 py-2 align-top">
        <code className="font-mono text-xs text-gray-800 dark:text-gray-200">{cmd}</code>
      </td>
      <td className="px-4 py-2">{desc}</td>
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
