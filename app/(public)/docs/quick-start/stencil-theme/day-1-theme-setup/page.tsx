import type { Metadata } from "next";
import Link from "next/link";
import {
  DocLayout,
  Section,
  Code,
  CodeFile,
  C,
  Callout,
  Checkpoint,
  SecurityAlert,
  Steps,
  Task,
  DocLink,
  type TocItem,
} from "@/components/public/doc";
import { Diagram, FileTree, Flow, FlowStep } from "@/components/public/diagram";
import { DayComplete, DayTabs } from "@/components/public/QuickStartDays";
import { ADMIN_GUIDE_HREF } from "@/components/public/quick-start";

export const metadata: Metadata = {
  title: "Day 1: Stencil Theme Setup - Stencil Quick Start - Codinative Developers",
};

const TOC: TocItem[] = [
  { id: "goals", title: "Today's goals" },
  { id: "node", title: "1. Node with nvm" },
  { id: "cli", title: "2. Install Stencil CLI" },
  { id: "token", title: "3. Store & token" },
  { id: "cornerstone", title: "4. Get Cornerstone" },
  { id: "init", title: "5. stencil init" },
  { id: "start", title: "6. Run it locally" },
  { id: "structure", title: "7. File structure" },
  { id: "handlebars", title: "8. Handlebars basics" },
  { id: "config", title: "9. config.json & Page Builder" },
  { id: "custom-page", title: "10. A page with its own URL" },
  { id: "push", title: "11. Bundle & push" },
  { id: "pull", title: "12. Pull Page Builder changes" },
  { id: "commands", title: "Command reference" },
  { id: "troubleshooting", title: "Troubleshooting" },
  { id: "done", title: "Day 1 checklist" },
];

export default function Day1() {
  return (
    <DocLayout
      header={<DayTabs />}
      title="Day 1: Stencil Theme Setup"
      intro="Today you go from nothing installed to a Cornerstone theme running locally against your sandbox store. Along the way you'll add a Page Builder setting, create a page with its own URL, and push your theme live on the sandbox."
      toc={TOC}
    >
      <Section id="goals" title="Today's goals">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Node.js installed through nvm, and the Stencil CLI installed globally.</li>
          <li>A Stencil-CLI token for your sandbox store, stored safely.</li>
          <li>
            Cornerstone running at <C>http://localhost:3000</C> with live data from your sandbox.
          </li>
          <li>
            You understand the theme&rsquo;s folders, Handlebars, and how <C>config.json</C> /{" "}
            <C>schema.json</C> drive Page Builder.
          </li>
          <li>
            A <C>/quick-start-lab/</C> page running on your own template. You&rsquo;ll use it on
            Days 2 to 4.
          </li>
          <li>Your theme bundled, pushed and applied on the sandbox.</li>
        </ul>
        <Diagram caption="The Stencil development loop you'll run today">
          <Flow>
            <FlowStep title="Edit locally" desc="templates, SCSS, JS, config" />
            <FlowStep title="stencil start" desc="preview with live store data" />
            <FlowStep title="git commit" desc="every working step" />
            <FlowStep title="stencil push" desc="bundle + upload + apply" tone="accent" />
          </Flow>
        </Diagram>
      </Section>

      <Section id="node" title="1. Install Node.js with nvm">
        <p>
          The Stencil CLI is a Node.js program, and each CLI release requires a specific Node
          major version. A version manager lets you switch Node per project without reinstalling.
        </p>
        <Steps>
          <li>
            Install nvm. <strong>Windows:</strong> follow the{" "}
            <Link
              href="/docs/environment-setup"
              className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300"
            >
              Environment setup
            </Link>{" "}
            guide (nvm-windows). <strong>macOS / Linux:</strong>
            <Code>{`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# close and reopen the terminal, then:
nvm --version`}</Code>
          </li>
          <li>
            Install and use <strong>Node 24</strong>, the version the current Stencil CLI (v10)
            requires:
            <Code>{`nvm install 24
nvm use 24
nvm alias default 24   # macOS/Linux: make it the default for new terminals
node -v                # v24.x.x
npm -v`}</Code>
          </li>
        </Steps>
        <Callout tone="warn">
          <p>
            <strong>Heads-up: Node version mismatch.</strong> Stencil CLI 10 requires Node 24 or
            newer and refuses to run on older versions. Cornerstone&rsquo;s own <C>.nvmrc</C>{" "}
            still says Node 20. <strong>Don&rsquo;t run <C>nvm use</C> inside the theme
            folder</strong>, because it will switch you to 20 and the CLI will stop working. Stay
            on 24.
          </p>
          <p className="mt-2">
            If a client project is locked to Node 20, a senior developer will tell you which older
            CLI major to install (for example <C>npm install -g @bigcommerce/stencil-cli@9</C>).
            Check with <C>stencil --version</C>.
          </p>
        </Callout>
        <Checkpoint>
          <C>node -v</C> prints <C>v24.x.x</C> in a brand-new terminal window.
        </Checkpoint>
      </Section>

      <Section id="cli" title="2. Install the Stencil CLI">
        <Code>{`npm install -g @bigcommerce/stencil-cli
stencil --version
stencil --help`}</Code>
        <p>
          <C>-g</C> installs it globally, so the <C>stencil</C> command works in any folder. Note
          that global packages belong to a Node version: if you later <C>nvm install</C> a
          different Node, install the CLI again under it.
        </p>
        <Checkpoint>
          <C>stencil --version</C> prints a version number, and <C>stencil --help</C> lists{" "}
          <C>init</C>, <C>start</C>, <C>bundle</C>, <C>push</C>, <C>pull</C>, <C>download</C>.
        </Checkpoint>
      </Section>

      <Section id="token" title="3. Your sandbox store & Stencil-CLI token">
        <p>You need two things from your sandbox store:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>The storefront URL</strong>, for example{" "}
            <C>https://codinative-sandbox-ali.mybigcommerce.com</C>. This is the shop&rsquo;s home
            page, not the <C>/manage</C> control-panel URL.
          </li>
          <li>
            <strong>A Stencil-CLI access token</strong> for that store.
          </li>
        </ul>
        <Callout>
          <strong>Credentials are normally provided.</strong> Your onboarding pack should include
          the sandbox URL, a control-panel login, and a Stencil-CLI token in the secrets vault. If
          any of those is missing, <strong>ask a senior developer for sandbox credentials</strong>{" "}
          before continuing. Don&rsquo;t create a trial store on your own.
        </Callout>
        <p>If you have control-panel access and need to create the token yourself:</p>
        <Steps>
          <li>
            In the control panel go to <strong>Settings › API › Store-level API accounts</strong>.
          </li>
          <li>
            Open the <strong>Create API account</strong> dropdown and choose{" "}
            <strong>Create Stencil-CLI token</strong>.
          </li>
          <li>
            Name it after yourself and your machine (e.g. <C>stencil-ali-macbook</C>).
          </li>
          <li>
            Pick the access level. <strong>local development only</strong> can read theme data but
            can&rsquo;t publish. <strong>publish theme</strong> can also push and apply themes. You
            push to the sandbox in step 11, so choose <em>publish theme</em> on the sandbox.
          </li>
          <li>
            Save and copy the <strong>access token</strong> straight into the secrets vault or your
            password manager. It&rsquo;s shown only once.
          </li>
        </Steps>
        <p>
          Screens for every step are in the{" "}
          <Link
            href={`${ADMIN_GUIDE_HREF}#create-token`}
            className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300"
          >
            Admin panel guide
          </Link>
          .
        </p>
        <SecurityAlert title="Treat the Stencil token like a password">
          <p>
            A <em>publish theme</em> token can replace a store&rsquo;s live theme. Never commit it,
            paste it into chat or an AI tool, or put it in a screenshot. Never use a client
            store&rsquo;s token for practice. If you think it has leaked, delete that API account
            in the control panel straight away and tell your lead.
          </p>
        </SecurityAlert>
      </Section>

      <Section id="cornerstone" title="4. Download the Cornerstone theme">
        <p>
          <strong>Cornerstone</strong> is BigCommerce&rsquo;s reference Stencil theme, and almost
          every client theme is built on it. There are two ways to get it:
        </p>
        <p>
          <strong>Option A: clone from GitHub</strong> (recommended for this Quick Start):
        </p>
        <Code>{`mkdir -p ~/bigcommerce && cd ~/bigcommerce
git clone https://github.com/bigcommerce/cornerstone.git quickstart-theme
cd quickstart-theme

# keep BigCommerce's repo as "upstream" and push your work to your own repo
git remote rename origin upstream
# create an empty repo on GitHub, then:
git remote add origin git@github.com:<you>/quickstart-theme.git`}</Code>
        <p>
          <strong>Option B: download from the control panel</strong>. This is how you&rsquo;ll
          start client projects, because it gives you the theme <em>as that store currently runs
          it</em>. Go to <strong>Storefront › Themes</strong>, open the <strong>&hellip;</strong>{" "}
          (Action) menu next to the theme, and choose <strong>Download current theme</strong>.
          Unzip it into a folder and <C>git init</C> it.
        </p>
        <Callout tone="warn">
          A downloaded theme does <strong>not</strong> include the settings a merchant saved in
          Page Builder. You pull those separately with <C>stencil pull</C> (step 12).
        </Callout>
      </Section>

      <Section id="init" title="5. Connect the theme to your store: stencil init">
        <p>From inside the theme folder, run:</p>
        <Code>{`stencil init`}</Code>
        <p>It asks four questions. Here&rsquo;s what each one means:</p>
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              <tr className="divide-x divide-gray-200 dark:divide-gray-800">
                <th className="px-4 py-2 font-medium">Prompt</th>
                <th className="px-4 py-2 font-medium">What to enter</th>
                <th className="px-4 py-2 font-medium">Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600 dark:divide-gray-800 dark:text-gray-300">
              <Row
                a="What is the URL of your store's home page?"
                b="The storefront URL including https://. The CLI pulls live data (products, categories, settings) from here."
                c="-u, --url"
              />
              <Row
                a="What is your Stencil OAuth Access Token?"
                b="The Stencil-CLI token from step 3."
                c="-t, --token"
              />
              <Row
                a="What port would you like to run the server on?"
                b="Press Enter for 3000. Choose another port if 3000 is busy or you run two themes at once."
                c="-p, --port"
              />
              <Row
                a="What is your favourite Package Manager?"
                b="npm. The CLI then installs the theme's dependencies for you."
                c="-pm, --packageManager (or -skip to skip installing)"
              />
            </tbody>
          </table>
        </div>
        <p>
          The CLI splits what you entered into <strong>two files</strong> in the theme root:
        </p>
        <CodeFile name="config.stencil.json (safe settings)">{`{
  "normalStoreUrl": "https://codinative-sandbox-ali.mybigcommerce.com",
  "port": 3000,
  "apiHost": "https://api.bigcommerce.com",
  "customLayouts": {
    "brand": {},
    "category": {},
    "page": {},
    "product": {}
  }
}`}</CodeFile>
        <CodeFile name="secrets.stencil.json (the token, never commit)">{`{
  "accessToken": "••••••••••••••••••••"
}`}</CodeFile>
        <SecurityAlert title="secrets.stencil.json must never reach Git">
          <p>
            Cornerstone&rsquo;s <C>.gitignore</C> already excludes <C>secrets.stencil.json</C>,{" "}
            <C>config.stencil.json</C> and the legacy <C>.stencil</C> file. Before your first
            commit, confirm it:
          </p>
          <Code>{`git check-ignore secrets.stencil.json   # must print the filename
git status                               # must NOT list secrets.stencil.json`}</Code>
          <p>
            Avoid the non-interactive <C>stencil init --token ...</C> form on shared machines: it
            leaves the token in your shell history.
          </p>
        </SecurityAlert>
        <p>
          If you skipped the dependency install, run <C>npm install</C> yourself before
          continuing.
        </p>
      </Section>

      <Section id="start" title="6. Run the theme locally">
        <Code>{`stencil start`}</Code>
        <Steps>
          <li>
            If the store has more than one storefront channel, the CLI asks which one to use. On a
            sandbox, pick the default storefront.
          </li>
          <li>
            Wait for webpack to finish its first build, then open <C>http://localhost:3000</C>.
          </li>
          <li>
            Leave it running. It watches your files, rebuilds JS and SCSS, and reloads the browser
            on every save. Type <C>rs</C> and press Enter to force a reload, and{" "}
            <C>Ctrl + C</C> to stop.
          </li>
        </Steps>
        <p>Useful variations:</p>
        <Code>{`stencil start -o            # open the browser automatically
stencil start -n            # no cache: always fetch fresh store data (default cache: 5 min)
stencil start -v Bold       # preview a different variation (Light / Bold / Warm)
stencil start -p 3100       # different port`}</Code>
        <Callout>
          The local server renders <strong>your local templates</strong> with{" "}
          <strong>live store data</strong> (products, cart, customers), using the settings in your
          local <C>config.json</C>. Page Builder changes made in the control panel don&rsquo;t show
          locally until you run <C>stencil pull</C>.
        </Callout>
        <Checkpoint>
          <C>http://localhost:3000</C> shows Cornerstone with <em>your sandbox&rsquo;s</em>{" "}
          products, and clicking into a product works. Commit:{" "}
          <C>git commit -am &quot;chore: initial Cornerstone setup&quot;</C>.
        </Checkpoint>
      </Section>

      <Section id="structure" title="7. A tour of the file structure">
        <Diagram caption="The Cornerstone folders you'll touch most">
          <FileTree
            lines={[
              { name: "assets", dir: true, note: "everything compiled or served as a static file" },
              { name: "js", dir: true, depth: 1, note: "theme JavaScript, bundled by webpack" },
              { name: "app.js", depth: 2, note: "entry point: maps page types to JS classes" },
              { name: "theme", dir: true, depth: 2, note: "one class per page type + global/" },
              { name: "scss", dir: true, depth: 1, note: "styles; theme.scss is the entry" },
              { name: "img, icons, fonts", depth: 1, note: "static assets" },
              { name: "templates", dir: true, note: "Handlebars HTML" },
              { name: "layout", dir: true, depth: 1, note: "base.html: <html>, <head>, header/footer" },
              { name: "pages", dir: true, depth: 1, note: "one template per page type" },
              { name: "custom", dir: true, depth: 2, note: "custom templates: page/ product/ category/ brand/" },
              { name: "components", dir: true, depth: 1, note: "reusable partials (product card, header...)" },
              { name: "lang", dir: true, note: "en.json etc.: translatable strings for {{lang}}" },
              { name: "config.json", note: "theme settings values + variations" },
              { name: "schema.json", note: "the Page Builder › Theme Styles controls" },
              { name: "schemaTranslations.json", note: "labels for schema.json in each language" },
              { name: "webpack.common.js", note: "JS build config (Day 2)" },
              { name: "config.stencil.json", note: "local CLI config (git-ignored)" },
              { name: "secrets.stencil.json", note: "your token (git-ignored, never commit)" },
            ]}
          />
        </Diagram>
        <p>
          How a page renders: BigCommerce picks the template for the page type (for example{" "}
          <C>templates/pages/product.html</C>). The template fills named <C>partial</C> blocks
          and hands them to <C>templates/layout/base.html</C>, pulling in pieces from{" "}
          <C>templates/components/</C>. Finally <C>assets/js/app.js</C> runs that page
          type&rsquo;s JavaScript class.
        </p>
      </Section>

      <Section id="handlebars" title="8. Handlebars in 10 minutes">
        <p>
          Stencil templates are HTML plus <strong>Handlebars</strong> expressions that read from
          the page&rsquo;s <em>context</em> (the data BigCommerce provides for that page).
        </p>
        <CodeFile name="Handlebars cheat sheet">{`{{page.title}}                         escaped output (safe default)
{{{page.content}}}                     raw HTML output (only for trusted HTML)
{{theme_settings.hide_page_heading}}   a value from config.json settings
{{lang 'header.skip_to_main'}}         a translated string from lang/en.json

{{#if customer}} Hi {{customer.name}} {{else}} Hello guest {{/if}}
{{#each product.images}} <img src="{{getImage this 'product_size'}}"> {{/each}}

{{> components/common/breadcrumbs breadcrumbs=breadcrumbs}}   include a partial

{{#partial "page"}} ...page body... {{/partial}}
{{> layout/base}}                      render the layout, filling "page"`}</CodeFile>
        <p>
          <strong>Front matter</strong> is the YAML block at the very top of a page template. It
          asks BigCommerce to load extra data into the context. For example, the top of{" "}
          <C>templates/pages/home.html</C>:
        </p>
        <CodeFile name="templates/pages/home.html (top of the file)">{`---
products:
    new:
        limit: {{theme_settings.homepage_new_products_count}}
    featured:
        limit: {{theme_settings.homepage_featured_products_count}}
---`}</CodeFile>
        <p>
          <strong>See the context.</strong> While <C>stencil start</C> is running, add{" "}
          <C>?debug=context</C> to any local URL (for example{" "}
          <C>http://localhost:3000/?debug=context</C>) to see the full JSON your template can use.
          This is the fastest way to find the variable you need.
        </p>
        <Task title="Task 1.1: Your first template change">
          <Steps>
            <li>
              Open <C>templates/pages/home.html</C>. Inside <C>{`{{#partial "page"}}`}</C>, just
              after <C>{`<div class="main full">`}</C>, add:
              <Code>{`<p class="quickstart-hello">Welcome to {{settings.store_name}}, built by {{lang 'quickstart.author'}}</p>`}</Code>
            </li>
            <li>
              Open <C>lang/en.json</C> and add a top-level key (watch the commas, since JSON is
              strict):
              <Code>{`"quickstart": {
    "author": "the Codinative Quick Start"
},`}</Code>
            </li>
            <li>Save both files and watch the browser reload.</li>
          </Steps>
          <Checkpoint>
            The home page shows your sentence with the sandbox store&rsquo;s real name. Change the{" "}
            <C>lang</C> value and the page updates.
          </Checkpoint>
        </Task>
      </Section>

      <Section id="config" title="9. config.json, schema.json & Page Builder">
        <p>
          This is the most important concept of the day. A theme&rsquo;s merchant-facing options
          are defined by <strong>two files that work as a pair</strong>:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <C>config.json</C> holds <strong>the values</strong>. Its <C>settings</C> object has
            the default value of every theme setting. Each entry in <C>variations</C> (Light, Bold,
            Warm) can override those values. It also holds <C>name</C>, <C>version</C>,{" "}
            <C>meta</C>, <C>resources</C> (e.g. how many products load per page) and{" "}
            <C>read_only_files</C>.
          </li>
          <li>
            <C>schema.json</C> holds <strong>the controls</strong>. It&rsquo;s a list of sections,
            and each setting in it has a <C>type</C> (text, checkbox, select, color, font&hellip;), a{" "}
            <C>label</C>, and an <C>id</C>.
          </li>
          <li>
            <strong>The <C>id</C> in schema.json must match a key in config.json&rsquo;s{" "}
            <C>settings</C></strong>. Page Builder&rsquo;s <em>Theme Styles</em> panel renders a
            control for each schema entry and reads and writes the config value with the same
            key. A schema setting with no matching config key doesn&rsquo;t appear.
          </li>
          <li>
            Templates read the current value with <C>{`{{theme_settings.<key>}}`}</C>.
          </li>
        </ul>
        <Diagram caption="One setting, end to end">
          <Flow>
            <FlowStep title="config.json" desc='"quickstart_banner_text": "Hello"' />
            <FlowStep title="schema.json" desc='{ "type": "text", "id": "quickstart_banner_text" }' />
            <FlowStep title="Page Builder" desc="Theme Styles shows a text box" />
            <FlowStep title="Template" desc="{{theme_settings.quickstart_banner_text}}" tone="accent" />
          </Flow>
        </Diagram>
        <Task title="Task 1.2: Add a merchant-editable banner">
          <Steps>
            <li>
              In <C>config.json</C>, add two keys inside the top-level <C>settings</C> object:
              <CodeFile name="config.json → settings">{`"quickstart_show_banner": true,
"quickstart_banner_text": "Free shipping on orders over $50",`}</CodeFile>
            </li>
            <li>
              In <C>schema.json</C> (a JSON array), add a new section as the{" "}
              <strong>last element</strong> of the array. Add a comma after the previous
              section&rsquo;s closing <C>{`}`}</C>:
              <CodeFile name="schema.json (append to the array)">{`{
  "name": "Quick Start",
  "settings": [
    {
      "type": "heading",
      "content": "Announcement banner"
    },
    {
      "type": "checkbox",
      "label": "Show the banner",
      "id": "quickstart_show_banner",
      "force_reload": true
    },
    {
      "type": "text",
      "label": "Banner text",
      "id": "quickstart_banner_text",
      "force_reload": true
    }
  ]
}`}</CodeFile>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Cornerstone&rsquo;s own labels are keys like <C>i18n.Global</C> that are looked up
                in <C>schemaTranslations.json</C>. Plain text labels are fine for your own
                settings. Use i18n keys when the theme must support several admin languages.
              </span>
            </li>
            <li>
              Use the settings in <C>templates/layout/base.html</C>, right after the opening{" "}
              <C>{`<body>`}</C> tag:
              <Code>{`{{#if theme_settings.quickstart_show_banner}}
    <div class="quickstart-banner" role="note">{{theme_settings.quickstart_banner_text}}</div>
{{/if}}`}</Code>
            </li>
            <li>
              Style it: create <C>assets/scss/custom/_quickstart.scss</C> with the rule below, and
              add <C>@import &quot;custom/quickstart&quot;;</C> at the end of{" "}
              <C>assets/scss/theme.scss</C>.
              <Code>{`.quickstart-banner {
    padding: 0.5rem 1rem;
    text-align: center;
    background: stencilColor("color-primary");
    color: #fff;
}`}</Code>
            </li>
          </Steps>
          <Checkpoint>
            The banner shows on every local page. Set <C>quickstart_show_banner</C> to{" "}
            <C>false</C> in <C>config.json</C> and it disappears (restart <C>stencil start</C> if a
            config change doesn&rsquo;t reload). Put it back to <C>true</C>. You&rsquo;ll see these
            controls in Page Builder after you push in step 11.
          </Checkpoint>
        </Task>
        <Callout tone="warn">
          <C>stencil bundle</C> validates both files. A trailing comma, a schema <C>id</C> with no
          config key, or a <C>schema.json</C> over 64&nbsp;KB will fail the bundle. Run{" "}
          <C>stencil bundle</C> early whenever you edit them.
        </Callout>
      </Section>

      <Section id="custom-page" title="10. Create a page with its own URL">
        <p>
          A <strong>custom template</strong> gives one specific page (or product, category or
          brand) its own layout. For a page it takes three pieces: the template file, a web page in
          the control panel, and a mapping so that <C>stencil start</C> knows about it.
        </p>
        <Task title="Task 1.3: The Quick Start Lab page">
          <Steps>
            <li>
              <strong>Create the web page in the store.</strong> In the control panel go to{" "}
              <strong>Storefront › Web Pages › Create a Web Page</strong>. Under &ldquo;This page
              will&rdquo; choose the normal content (WYSIWYG editor) option, name it <C>Quick Start Lab</C>, and
              set the <strong>Page URL</strong> to <C>/quick-start-lab/</C>. Optionally untick
              &ldquo;show in navigation&rdquo;. Save. (Screens:{" "}
              <Link
                href={`${ADMIN_GUIDE_HREF}#web-pages`}
                className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300"
              >
                Admin guide › Web pages
              </Link>
              .)
            </li>
            <li>
              <strong>Create the template</strong> by copying the structure of{" "}
              <C>templates/pages/page.html</C>:
              <CodeFile name="templates/pages/custom/page/quick-start-lab.html">{`{{#partial "page"}}

{{> components/common/breadcrumbs breadcrumbs=breadcrumbs}}

<main class="page">
    <h1 class="page-heading">{{page.title}}</h1>

    {{{region name="page_builder_content"}}}

    <div class="page-content">
        <p>This page is rendered by <code>custom/page/quick-start-lab.html</code>.</p>

        {{!-- Days 2 to 4 mount JavaScript and React here --}}
        <div id="quickstart-js-root"></div>
        <div id="quickstart-react-root"></div>
    </div>
</main>

{{/partial}}

{{> layout/base}}`}</CodeFile>
            </li>
            <li>
              <strong>Map it for local development</strong> in <C>config.stencil.json</C>. The key
              is the template file name; the value is the page URL, which must already exist in
              the store:
              <CodeFile name="config.stencil.json">{`"customLayouts": {
  "brand": {},
  "category": {},
  "page": {
    "quick-start-lab.html": "/quick-start-lab/"
  },
  "product": {}
}`}</CodeFile>
            </li>
            <li>
              <strong>Restart</strong> <C>stencil start</C> (it reads <C>customLayouts</C> only on
              startup) and open <C>http://localhost:3000/quick-start-lab/</C>.
            </li>
          </Steps>
          <Checkpoint>
            Locally, the Quick Start Lab page shows &ldquo;This page is rendered by
            custom/page/quick-start-lab.html&rdquo;. On the live sandbox it still uses the default
            page template. You&rsquo;ll fix that after pushing.
          </Checkpoint>
        </Task>
        <Callout>
          <C>customLayouts</C> only affects <strong>your local preview</strong>. On the real store,
          a page uses a custom template only when a merchant selects it in the web page&rsquo;s{" "}
          <strong>Template layout file</strong> setting. That dropdown lists templates from a
          theme that has been uploaded to the store, which is why we push next.
        </Callout>
      </Section>

      <Section id="push" title="11. Bundle, push and apply the theme">
        <p>
          <C>stencil bundle</C> validates the theme and builds a production zip.{" "}
          <C>stencil push</C> bundles <em>and</em> uploads it in one step.
        </p>
        <Code>{`stencil bundle                 # validates the theme and writes a .zip into the theme folder
stencil push                   # bundle + upload; asks whether to apply it and which variation
stencil push -a Light          # bundle + upload + apply the "Light" variation, no prompts
stencil push -a Light -d       # same, and delete the oldest private theme if the store is at its limit`}</Code>
        <div className="grid gap-3 sm:grid-cols-2">
          <Callout>
            <strong>Manual upload</strong>: in <strong>Storefront › Themes</strong> click{" "}
            <strong>Upload theme</strong>, select the zip from <C>stencil bundle</C>, then{" "}
            <strong>Apply</strong> it and pick a variation.
          </Callout>
          <Callout tone="warn">
            <strong>Limits</strong>: a bundle must be <strong>50&nbsp;MB or less</strong>, and a
            store holds at most <strong>20 custom themes</strong>. Keep large media out of the
            theme and use WebDAV instead.
          </Callout>
        </div>
        <SecurityAlert title="Pushing replaces what shoppers see">
          <p>
            <C>stencil push -a</C> makes your local code <strong>live</strong> the moment it
            finishes. In this Quick Start you only push to <strong>your sandbox</strong>. On client
            stores, pushing and applying is a release step that needs review and approval. Never
            push a client store from your practice folder.
          </p>
        </SecurityAlert>
        <Task title="Task 1.4: Go live on the sandbox">
          <Steps>
            <li>
              Run <C>stencil push -a Light</C> and wait for &ldquo;Done&rdquo;.
            </li>
            <li>
              In the control panel, open <strong>Storefront › Web Pages</strong>, edit{" "}
              <em>Quick Start Lab</em>, and under the advanced options set{" "}
              <strong>Template layout file</strong> to <C>quick-start-lab</C>. Save.
            </li>
            <li>
              Open <strong>Storefront › Themes › Edit in Page Builder</strong>, open{" "}
              <em>Theme Styles</em>, and find your <strong>Quick Start</strong> section.
            </li>
          </Steps>
          <Checkpoint>
            On the <em>live</em> sandbox URL, the banner shows, and <C>/quick-start-lab/</C> renders
            your custom template. In Page Builder, the &ldquo;Show the banner&rdquo; checkbox and
            &ldquo;Banner text&rdquo; field change the preview.
          </Checkpoint>
        </Task>
      </Section>

      <Section id="pull" title="12. Pull Page Builder changes back into code">
        <p>
          Merchants change settings in Page Builder, and those values live on the store. If you
          push your local <C>config.json</C> without pulling first, you can overwrite their work.
        </p>
        <Task title="Task 1.5: The round trip">
          <Steps>
            <li>
              In Page Builder, change &ldquo;Banner text&rdquo; to something new and click{" "}
              <strong>Publish</strong>.
            </li>
            <li>
              Locally, run <C>stencil pull</C>.
            </li>
            <li>
              Run <C>git diff config.json</C>.
            </li>
          </Steps>
          <Checkpoint>
            The diff shows the new banner text written into the <strong>active variation&rsquo;s</strong>{" "}
            <C>settings</C> block (inside <C>variations</C>), not the top-level <C>settings</C>.
            Variation settings override the defaults, so the local site now matches the live one.
            Commit it.
          </Checkpoint>
        </Task>
        <p>
          Rule to live by: <strong>always <C>stencil pull</C> before <C>stencil push</C></strong>{" "}
          on any store a merchant uses.
        </p>
      </Section>

      <Section id="commands" title="Stencil command reference">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              <tr className="divide-x divide-gray-200 dark:divide-gray-800">
                <th className="px-4 py-2 font-medium">Command</th>
                <th className="px-4 py-2 font-medium">What it does</th>
                <th className="px-4 py-2 font-medium">Useful flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600 dark:divide-gray-800 dark:text-gray-300">
              <Row code a="stencil init" b="Connect a theme folder to a store (writes config.stencil.json + secrets.stencil.json)" c="-u url, -t token, -p port" />
              <Row code a="stencil start" b="Local dev server with live store data, file watching and reload" c="-o open, -n no cache, -v variation, -c channel id, -p port" />
              <Row code a="stencil bundle" b="Validate and zip the theme for upload" c="-n name, -d destination, -S source maps" />
              <Row code a="stencil push" b="Bundle + upload to the store" c="-a [variation] apply, -d delete oldest, -f existing zip, -c channel ids" />
              <Row code a="stencil pull" b="Write the live theme configuration into config.json" c="-s saved (unpublished) config, -f filename, -c channel id" />
              <Row code a="stencil download" b="Download the live theme's files (e.g. Code Editor changes)" c="-f file, -e exclude, -o overwrite" />
              <Row code a="stencil debug" b="Print environment info to attach when asking for help" c="-o output file" />
              <Row code a="stencil scss-autofix" b="Fix SCSS that breaks under the modern Sass compiler" c="-d dry run" />
              <Row code a="stencil release" b="Create a GitHub release of the theme (marketplace/partner themes)" c="-b branch" />
            </tbody>
          </table>
        </div>
        <p>
          Run <C>stencil &lt;command&gt; --help</C> for the full flag list, and see{" "}
          <DocLink href="https://docs.bigcommerce.com/developer/docs/storefront/stencil/cli">
            Stencil CLI docs
          </DocLink>
          .
        </p>
      </Section>

      <Section id="troubleshooting" title="Troubleshooting">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
              <tr className="divide-x divide-gray-200 dark:divide-gray-800">
                <th className="px-4 py-2 font-medium">Symptom</th>
                <th className="px-4 py-2 font-medium">Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600 dark:divide-gray-800 dark:text-gray-300">
              <Row a="CLI error about the Node version" b="node -v must be 24+. You probably ran nvm use inside the theme folder (its .nvmrc says 20). Run nvm use 24, and reinstall the CLI if 'stencil' is not found." />
              <Row a="401 / 403 / 'invalid token' on stencil start" b="Wrong or revoked token, or a V2/V3 token instead of a Stencil-CLI token. Also check normalStoreUrl is the storefront URL with https://." />
              <Row a="Port 3000 is already in use" b="Stop the other process, or run stencil start -p 3100." />
              <Row a="Custom template not used locally" b="The URL in customLayouts must exist in the store and match exactly, including the trailing slash. Restart stencil start." />
              <Row a="Template missing from 'Template layout file' dropdown" b="The theme containing it hasn't been pushed and applied yet. Push, apply, then refresh the web page editor." />
              <Row a="stencil bundle: schema / JSON errors" b="Look for a trailing comma or a missing comma in config.json, schema.json or lang/en.json, or a schema id without a matching config key." />
              <Row a="npm install fails with node-gyp / sass errors" b="Delete node_modules and package-lock changes, confirm you're on Node 24, run npm install again. Still failing: share 'stencil debug' output with a senior." />
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="done" title="Day 1 checklist">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Node 24 via nvm; <C>stencil --version</C> works.</li>
          <li>Token stored safely; <C>secrets.stencil.json</C> is git-ignored.</li>
          <li>Cornerstone runs locally with sandbox data.</li>
          <li>Home page greeting (Task 1.1) and the Page Builder banner (Task 1.2) work.</li>
          <li>
            <C>/quick-start-lab/</C> renders the custom template both locally and live.
          </li>
          <li>You&rsquo;ve done a Page Builder change → <C>stencil pull</C> round trip.</li>
          <li>All of it committed to your own Git repo.</li>
        </ul>
        <DayComplete day={1} />
      </Section>
    </DocLayout>
  );
}

function Row({ a, b, c, code }: { a: string; b: string; c?: string; code?: boolean }) {
  return (
    <tr className="divide-x divide-gray-200 dark:divide-gray-800">
      <td className="px-4 py-2 align-top">
        {code ? (
          <code className="font-mono text-xs whitespace-nowrap text-gray-800 dark:text-gray-200">
            {a}
          </code>
        ) : (
          a
        )}
      </td>
      <td className="px-4 py-2 align-top">{b}</td>
      {c !== undefined && (
        <td className="px-4 py-2 align-top font-mono text-xs text-gray-700 dark:text-gray-300">
          {c}
        </td>
      )}
    </tr>
  );
}
